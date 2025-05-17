using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class CartController : ControllerBase
    {
       public readonly ApplicationDbContext dbContext;
        
       public CartController(ApplicationDbContext dbContext) 
       {
            this.dbContext = dbContext;
       }


        [HttpPost("/cart")]
        public IActionResult AddToCart([FromBody] CartDto cartDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { success = false, message = "User not logged in." });

            var book = dbContext.Books.FirstOrDefault(b => b.Id == cartDto.BookId);
            if (book == null)
                return NotFound(new { success = false, message = "Book not found." });

            int quantity = cartDto.Quantity ?? 1;

            var existingCartItem = dbContext.Carts
                .FirstOrDefault(c => c.BookId == cartDto.BookId && c.UserId == userId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += quantity;
                dbContext.Carts.Update(existingCartItem);
            }
            else
            {
                var newCartItem = new Cart
                {
                    BookId = cartDto.BookId,
                    Quantity = quantity,
                    UserId = userId
                };
                dbContext.Carts.Add(newCartItem);
            }

            dbContext.SaveChanges();

            return Ok(new
            {
                success = true,
                message = "Book added to cart.",
            });
        }


        [HttpGet("/carts")]
        public async Task<IActionResult> GetCarts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("User is not logged in.");
            }

            var carts = await dbContext.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Book)
                .ToListAsync();

            return Ok(carts);
        }

        [HttpDelete("/cart/{cartId}")]
        public async Task<IActionResult> DeleteCart(long cartId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("User is not logged in.");
            }

            var cartItem = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == cartId);

            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            dbContext.Carts.Remove(cartItem);
            await dbContext.SaveChangesAsync();

            return StatusCode(200, new
            {
                success = true,
                message = "Cart item removed successfully."
            });
        }


        [HttpPut("/cart/{cartId}")]
        public async Task<IActionResult> UpdateCartItem(long cartId, [FromBody] CartUpdateDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized("User is not logged in.");
            }

            if (request.Quantity < 1)
            {
                return BadRequest("Quantity must be at least 1.");
            }

            var cartItem = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Id == cartId);

            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            cartItem.Quantity = request.Quantity;
            await dbContext.SaveChangesAsync();

            return Ok("Cart updated successfully.");
        }


    }
}
