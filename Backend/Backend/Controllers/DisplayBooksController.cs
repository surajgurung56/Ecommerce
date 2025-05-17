using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class DisplayBooksController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;

        public DisplayBooksController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("/popular-books")]
        public List<PopularBooksResponseDto> GetTopBooksForHomePage()
        {
            var topBooks = dbContext.OrderItems
                .Where(oi => oi.BookId != null)
                .GroupBy(oi => oi.BookId)
                .Select(group => new
                {
                    BookId = group.Key,
                    TotalQuantity = group.Sum(oi => oi.Quantity)
                })
                .OrderByDescending(g => g.TotalQuantity)
                .Join(dbContext.Books,
                      g => g.BookId,
                      b => b.Id,
                      (g, b) => new PopularBooksResponseDto
                      {
                          Book = b,
                          TotalOrderedQuantity = g.TotalQuantity
                      })
                .ToList();

            return topBooks;
        }

        [HttpGet("/new-arrivals")]
        public IActionResult GetNewArrivals()
        {
            var books = dbContext.Books
                .OrderByDescending(b => b.AddedDate)
                .ThenByDescending(b => b.Id)
                .ToList();
            return Ok(new {Success=true, data = books});
        }

    }
}
