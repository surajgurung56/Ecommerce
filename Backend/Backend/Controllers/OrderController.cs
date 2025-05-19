using System.Security.Claims;
using System.Text.Json;
using Backend.Data;
using Backend.Dtos;
using Backend.Enums;
using Backend.Interfaces;
using Backend.Models;
using Backend.Socket.Backend.Sockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;
        public readonly IEmailService emailService;
        public OrderController(ApplicationDbContext dbContext, IEmailService emailService) 
        { 
            this.dbContext = dbContext;
            this.emailService = emailService;
        }
        
        //[HttpPost("/order")]
        //public async Task<IActionResult> CreateOrder()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (userId == null)
        //        return Unauthorized("User not logged in.");

        //    var user = await dbContext.applicationUsers.FirstOrDefaultAsync(u => u.Id == userId);
        //    if (user == null)
        //        throw new Exception("User not found.");

        //    using var transaction = await dbContext.Database.BeginTransactionAsync();

        //    try
        //    {
        //        var cartItems = await dbContext.Carts
        //            .Include(c => c.Book)
        //            .Where(c => c.UserId == userId)
        //            .ToListAsync();

        //        if (!cartItems.Any())
        //            return BadRequest("Cart is empty");

        //        // Check stock availability
        //        foreach (var item in cartItems)
        //        {
        //            var book = item.Book;
        //            if (book.Stock < item.Quantity)
        //            {
        //                return BadRequest(new
        //                {
        //                    Success = false,
        //                    Message = $"Not enough stock for the book: {book.Title}. Available: {book.Stock}"
        //                });
        //            }
        //        }

        //        // Calculate discount
        //        var today = DateOnly.FromDateTime(DateTime.Today);
        //        double totalAmount = 0;
        //        long totalQuantity = 0;

        //        foreach (var item in cartItems)
        //        {
        //            var book = item.Book;
        //            double price = book.Price;

        //            if (
        //                book.DiscountPercentage.HasValue &&
        //                book.DiscountStartDate.HasValue &&
        //                book.DiscountEndDate.HasValue &&
        //                book.DiscountStartDate.Value <= today &&
        //                book.DiscountEndDate.Value >= today)
        //            {
        //                var discount = (book.DiscountPercentage.Value / 100.0) * book.Price;
        //                price = book.Price - discount;
        //            }

        //            totalQuantity += item.Quantity;
        //            totalAmount += item.Quantity * price;
        //        }
        //        Console.WriteLine("Before 5%: " + totalAmount);

        //        // Apply extra 5% discount
        //        if (totalQuantity > 5)
        //        {
        //            // 5/100 = 0.05
        //            var extraDiscount = totalAmount * 0.05;
        //            totalAmount -= extraDiscount;
        //        }
        //        Console.WriteLine("Before 5%: " + totalAmount);

        //        // Create order
        //        var order = new Order
        //        {
        //            UserId = userId,
        //            OrderDate = DateOnly.FromDateTime(DateTime.Today),
        //            TotalAmount = Convert.ToDecimal(totalAmount),
        //            Status = OrderStatus.PENDING.ToString(),
        //        };

        //        dbContext.Orders.Add(order);
        //        await dbContext.SaveChangesAsync();

        //        // Create order items
        //        foreach (var item in cartItems)
        //        {
        //            var book = item.Book;

        //            // Decrease book stock
        //            if (book.Stock >= item.Quantity)
        //            {
        //                book.Stock -= item.Quantity;
        //            }
        //            else
        //            {
        //                await transaction.RollbackAsync();
        //                return BadRequest(new { Success = false, Message = $"Not enough stock for the book: {book.Title}"});
        //            }

        //            var orderItem = new OrderItem
        //            {
        //                OrderId = order.Id,
        //                BookId = item.BookId.Value,
        //                Quantity = item.Quantity,
        //                Price = Convert.ToDecimal(
        //                    book.DiscountPercentage.HasValue &&
        //                    book.DiscountStartDate.HasValue &&
        //                    book.DiscountEndDate.HasValue &&
        //                    book.DiscountStartDate.Value <= today &&
        //                    book.DiscountEndDate.Value >= today
        //                        ? book.Price - (book.DiscountPercentage.Value / 100.0) * book.Price
        //                        : book.Price)
        //            };

        //            dbContext.OrderItems.Add(orderItem);
        //        }

        //        // clear the cart
        //        dbContext.Carts.RemoveRange(cartItems);

        //        await dbContext.SaveChangesAsync();
        //        await transaction.CommitAsync();

        //        // Send bill to user on mail
        //        await emailService.SendOrderClaimCodeAsync(user, order);
        //        await emailService.SendOrderNotificationToAdmin(user, order);

        //        // For web socket
        //        var messageObject = new
        //        {
        //            Success = true,
        //            MessageType = "NewOrder",
        //            User = user.Name,
        //            data = order.OrderItems
        //        };
        //        var jsonMessage = JsonSerializer.Serialize(messageObject);
        //        await WebSocketHandler.BroadcastAsync(jsonMessage);

        //        return Ok(new { message = "Order placed successfully", orderId = order.Id });
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();
        //        return StatusCode(500, $"Order creation failed: {ex.Message}");
        //    }
        //}
        
        [HttpPost("/order")]
        public async Task<IActionResult> CreateOrder()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { success = false, message = "User not logged in."});

            var user = await dbContext.applicationUsers.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { status = false, message = "User not found."});

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var cartItems = await dbContext.Carts
                    .Include(c => c.Book)
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                if (!cartItems.Any())
                    return BadRequest(new { status = false, message = "Cart is empty."});

                // Check stock availability
                foreach (var item in cartItems)
                {
                    var book = item.Book;
                    if (book.Stock < item.Quantity)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = $"Not enough stock for the book: {book.Title}. Available: {book.Stock}"
                        });
                    }
                }

                // Calculate discount
                var today = DateOnly.FromDateTime(DateTime.Today);
                double totalAmount = 0;
                long totalQuantity = 0;

                foreach (var item in cartItems)
                {
                    var book = item.Book;
                    double price = book.Price;

                    if (
                        book.DiscountPercentage.HasValue &&
                        book.DiscountStartDate.HasValue &&
                        book.DiscountEndDate.HasValue &&
                        book.DiscountStartDate.Value <= today &&
                        book.DiscountEndDate.Value >= today)
                    {
                        var discount = (book.DiscountPercentage.Value / 100.0) * book.Price;
                        price = book.Price - discount;
                    }
                    totalQuantity += item.Quantity;
                    totalAmount += item.Quantity * price;
                }

                Console.WriteLine("Before quantity discount: " + totalAmount);
                // 5% extra discount (5/100 = 0.05)
                if (totalQuantity > 5)
                {
                    var quantityDiscount = totalAmount * 0.05;
                    totalAmount -= quantityDiscount;
                    Console.WriteLine("After quantity discount (5%): " + totalAmount);
                }

                // Check if user has placed at least 10 successful orders
                var completedOrdersCount = await dbContext.Orders
                    .CountAsync(o => o.UserId == userId && o.Status == OrderStatus.COMPLETED.ToString());
                Console.WriteLine("completedOrdersCount: " + completedOrdersCount);

                // 10% extra discount (10/100 = 0.10)
                if (completedOrdersCount >= 10)
                {
                    var loyaltyDiscount = totalAmount * 0.10; 
                    totalAmount -= loyaltyDiscount;
                    Console.WriteLine("After loyalty discount (10%): " + totalAmount);
                }

                // Create order
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateOnly.FromDateTime(DateTime.Today),
                    TotalAmount = Convert.ToDecimal(Math.Round(totalAmount, 0)),
                    Status = OrderStatus.PENDING.ToString(),
                };

                dbContext.Orders.Add(order);
                await dbContext.SaveChangesAsync();

                // Pass the order items list to mail
                var orderItemsForMail = new List<OrderItem>();

                // Create order items
                foreach (var item in cartItems)
                {
                    var book = item.Book;

                    // Decrease book stock
                    if (book.Stock >= item.Quantity)
                    {
                        book.Stock -= item.Quantity;
                    }
                    else
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { success = false, message = $"Not enough stock for the book: {book.Title}"});
                    }

                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        BookId = item.BookId.Value,
                        Quantity = item.Quantity,
                        Price = Convert.ToDecimal(
                            book.DiscountPercentage.HasValue &&
                            book.DiscountStartDate.HasValue &&
                            book.DiscountEndDate.HasValue &&
                            book.DiscountStartDate.Value <= today &&
                            book.DiscountEndDate.Value >= today
                                ? book.Price - (book.DiscountPercentage.Value / 100.0) * book.Price
                                : book.Price)
                    };
                    orderItemsForMail.Add(orderItem);
                    dbContext.OrderItems.Add(orderItem);
                }

                // clear the cart
                dbContext.Carts.RemoveRange(cartItems);

                await dbContext.SaveChangesAsync();


                // Send bill to user on mail
                await emailService.SendOrderClaimCodeAsync(user, order, orderItemsForMail);
                //await emailService.SendOrderNotificationToAdmin(user, order, orderItemsForMail);

                // For web socket
                var messageObject = new
                {
                    success = true,
                    user = user.Name,
                    data = order.OrderItems
                };


                var jsonMessage = JsonSerializer.Serialize(messageObject);
                await WebSocketHandler.BroadcastAsync(jsonMessage);
                await transaction.CommitAsync();

                return Ok(new {success = true, message = "Order placed successfully", orderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { status = false, error = $"Order creation failed: {ex.Message}"});
            }
        }

        [HttpGet("/orders")]
        public async Task<IActionResult> GetOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("User is not logged in.");
            }

            var orders = await dbContext.Orders
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }


        //[HttpGet("/order/order-items/{orderId}")]
        //public async Task<IActionResult> GetOrderItems(long orderId)
        //{
        //    var orderItems = await dbContext.OrderItems
        //        .Where(o => o.OrderId == orderId)
        //        .Include(o => o.Book) 

        //        .ToListAsync();

        //    return Ok(new
        //    {
        //        success = true,
        //        data = orderItems
        //    });
        //}



        //[HttpGet("/order/order-items/{orderId}")]
        //public async Task<IActionResult> GetOrderItems(long orderId)
        //{
        //    var order = await dbContext.Orders
        //        .Where(o => o.Id == orderId)
        //        .Include(o => o.OrderItems)
        //            .ThenInclude(oi => oi.Book)
        //        .FirstOrDefaultAsync();

        //    if (order == null)
        //    {
        //        return NotFound(new { success = false, message = "Order not found" });
        //    }

        //    var orderDto = new OrderResponseDto
        //    {
        //        Id = order.Id,
        //        TotalAmount = order.TotalAmount,
        //        Status = order.Status,
        //        OrderDate = order.OrderDate,
        //        ClaimCode = order.ClaimCode,
        //        UserId = order.UserId,
        //        OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDto
        //        {
        //            Id = oi.Id,
        //            Quantity = oi.Quantity,
        //            Price = oi.Price,
        //            BookId = oi.BookId.Value,
        //            BookTitle = oi.Book.Title,
        //            BookAuthor = oi.Book.Author,
        //            imageURL = oi.Book.ImageURL,
        //            isbn = oi.Book.ISBN
        //        }).ToList()
        //    };

        //    return Ok(new
        //    {
        //        success = true,
        //        data = orderDto
        //    });
        //}

        [HttpGet("/order/order-items/{orderId}")]
        public async Task<IActionResult> GetOrderItems(long orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User is not logged in." });
            }

            var order = await dbContext.Orders
                .Where(o => o.Id == orderId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found." });
            }

            var bookIds = order.OrderItems
                .Where(oi => oi.BookId.HasValue)
                .Select(oi => oi.BookId.Value)
                .Distinct()
                .ToList();

            var reviewedBookIds = await dbContext.Reviews
                .Where(r => r.UserId == userId && bookIds.Contains(r.BookId))
                .Select(r => r.BookId)
                .ToListAsync();

            var orderDto = new OrderResponseDto
            {
                Id = order.Id,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                OrderDate = order.OrderDate,
                ClaimCode = order.ClaimCode,
                UserId = order.UserId,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    BookId = oi.BookId.Value,
                    BookTitle = oi.Book.Title,
                    BookAuthor = oi.Book.Author,
                    imageURL = oi.Book.ImageURL,
                    isbn = oi.Book.ISBN,
                    IsReviewed = reviewedBookIds.Contains(oi.BookId.Value)
                }).ToList()
            };

            return Ok(new
            {
                success = true,
                data = orderDto
            });
        }

        [HttpGet("/admin/orders")]
        public async Task<IActionResult> GetAllOrdersForAdmin()
        {
            var orders = await dbContext.Orders
                .Include(order => order.applicationUser) 
                .Select(order => new
                {
                    order.Id,
                    order.TotalAmount,
                    order.Status,
                    order.OrderDate,
                    order.ClaimCode,
                    order.UserId,
                    User = new
                    {
                        order.applicationUser.Name,
                        order.applicationUser.Email,
                        order.applicationUser.ContactNumber,
                        order.applicationUser.MembershipId
                    },
                    OrderItemCount = order.OrderItems.Count
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("/admin/order/status/{orderId}")]
        public async Task<IActionResult> GetOrderStatus(long orderId)
        {
            var orderStatus = await dbContext.Orders
                .Where(order => order.Id == orderId)
                .Select(order => new
                {
                    order.Id,
                    order.Status
                })
                .FirstOrDefaultAsync();

            if (orderStatus == null)
            {
                return NotFound(new {status=false, message = "Order not found." });
            }
            return Ok(orderStatus);
        }



        [HttpPut("/admin/order/status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(long orderId, [FromBody] UpdateOrderStatusDto request)
        {
            var order = await dbContext.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = request.Status;
            await dbContext.SaveChangesAsync();

            return Ok(new { success = true, message = "Order status updated successfully.", order.Id, order.Status });
        }




        [HttpPut("/order/cancel/{orderId}")]
        public async Task<IActionResult> CancelOrder(long orderId)
        {
            var order = await dbContext.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            if (order.Status == "CANCELLED")
            {
                return BadRequest(new { message = "Order is already cancelled." });
            }

            order.Status = "CANCELLED";
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Order has been successfully cancelled.",
                order.Id,
                order.Status
            });
        }












    }
}
