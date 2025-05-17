using System.Linq;
using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IBookService _bookService;

        public BookController(IBookService bookService, ApplicationDbContext context)
        {
            _bookService = bookService;
            dbContext = context;
        }

        [HttpPost("/book")]
        public async Task<ActionResult> CreateBook([FromForm] BookDto bookDto)
        {
            string imageUrl = null;

            if (bookDto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/books");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(bookDto.Image.FileName);
                var newFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await bookDto.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/books/{newFileName}";
            }

            var book = new Book
            {
                Title = bookDto.Title,
                Author = bookDto.Author,
                ISBN = bookDto.ISBN,
                Stock = bookDto.Stock,
                Price = bookDto.Price,
                Language = bookDto.Language,
                PublishedDate = bookDto.PublishedDate,
                PublicationName = bookDto.PublicationName,
                Description = bookDto.Description,
                Format = bookDto.Format,
                ImageURL = imageUrl,
                CategoryId = bookDto.CategoryId,

                DiscountPercentage = bookDto.DiscountPercentage,
                DiscountStartDate = bookDto.DiscountStartDate,
                DiscountEndDate = bookDto.DiscountEndDate,
            };

            dbContext.Books.Add(book);
            await dbContext.SaveChangesAsync();

            return StatusCode(201, new
            {
                success = true,
                message = "Book added successfully"
            });
        }

        [HttpGet("/book/{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            return Ok(new {success=true, data = await _bookService.GetBook(id)});
        }
        
        [HttpGet("/books")]
        public async Task<ActionResult<List<Book>>> GetAllBooks()
        {
            return Ok(new { success = true, data = await this._bookService.GetAllBooks()});
        }

        [HttpPut("/book/{id}")]
        public async Task<IActionResult> UpdateBook(long id, [FromForm] UpdateBookDto bookDto)
        {
            var book = await dbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { success = false, message = "Book not found" });
            }


            // Print the values
            Console.WriteLine("printing");
            Console.WriteLine($"Discount Percentage: {book.DiscountPercentage?.ToString() ?? "null"}");
            Console.WriteLine($"Discount Start Date: {book.DiscountStartDate?.ToString() ?? "null"}");
            Console.WriteLine($"Discount End Date: {book.DiscountEndDate?.ToString() ?? "null"}");
            Console.WriteLine("printed");

            book.Title = bookDto.Title;
            book.Author = bookDto.Author;
            book.ISBN = bookDto.ISBN;
            book.Stock = bookDto.Stock;
            book.Price = bookDto.Price;
            book.Language = bookDto.Language;
            book.PublishedDate = bookDto.PublishedDate;
            book.PublicationName = bookDto.PublicationName;
            book.Description = bookDto.Description;
            book.Format = bookDto.Format;
            book.CategoryId = bookDto.CategoryId;

            book.DiscountPercentage = bookDto.DiscountPercentage.HasValue ? bookDto.DiscountPercentage.Value : (int?)null;
            book.DiscountStartDate = bookDto.DiscountStartDate.HasValue ? bookDto.DiscountStartDate.Value : (DateOnly?)null;
            book.DiscountEndDate = bookDto.DiscountEndDate.HasValue ? bookDto.DiscountEndDate.Value : (DateOnly?)null;


            if (bookDto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/books");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(bookDto.Image.FileName);
                var newFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await bookDto.Image.CopyToAsync(stream);
                }

                book.ImageURL = $"/uploads/books/{newFileName}";
            }

            await dbContext.SaveChangesAsync();

            return Ok(new { success = true, message = "Book updated successfully" });
        }

        [HttpPost("/books/search")]
        public async Task<IActionResult> search([FromBody] SearchDto searchDto)
        {
            var query = dbContext.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                query = query.Where(b =>
                    b.Title.Contains(searchDto.Search) ||
                    b.ISBN.Contains(searchDto.Search) ||
                    b.Description.Contains(searchDto.Search)
                );
            }
            var books = await query.ToListAsync();

            return Ok(new
            {
                success = true,
                data = books
            });
        }

        [HttpPost("/books/filter")]
        public async Task<IActionResult> filter([FromBody] BookFilterDto filterDto)
        {
            var query = dbContext.Books.AsQueryable();

            if (filterDto.Categories.Any())
            {
                query = query.Where(b => filterDto.Categories.Contains(b.CategoryId));
            }

            if (filterDto.Formats.Any())
            {
                query = query.Where(b => filterDto.Formats.Contains(b.Format));
            }

            var books = await query.ToListAsync();

            return Ok(new
            {
                success = true,
                data = books
            });
        }

        [HttpPost("/books/sort-by")]
        public async Task<IActionResult> SortBy([FromBody] BookSortDto bookSortDto)
        {
            var sortBy = bookSortDto.SortBy?.ToLowerInvariant() ?? "title";

            var query = dbContext.Books.AsQueryable();


            if (sortBy == "price")
            {
                query = query.OrderBy(b => b.Price);
            }
            else if (sortBy == "publishdate")
            {
                query = query.OrderBy(b => b.PublishedDate);
            }
            else 
            {
                query = query.OrderBy(b => b.Title);
            }
            var books = await query.ToListAsync();

            return Ok(new
            {
                success = true,
                data = books
            });
        }

        [HttpPatch("/books/{id}/toggle-sale")]
        public async Task<IActionResult> ToggleSale(long id)
        {
            var book = await dbContext.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(new { success = false, message = "Book not found." });
            }

            book.IsOnSale = !book.IsOnSale;

            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = book.IsOnSale ? "Book is now on sale." : "Sale removed from book.",
            });
        }

        [HttpDelete("/book/{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var success = await _bookService.DeleteBookAsync(id);
                return success
                    ? Ok(new { success = true, message = "Book deleted successfully." })
                    : NotFound(new { success = false, message = "Book not found." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}

