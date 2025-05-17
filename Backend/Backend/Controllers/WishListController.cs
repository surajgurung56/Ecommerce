using System.Security.Claims;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize]
    [Route("/api")]
    [ApiController]
    public class WishListController : Controller
    {

        public readonly ApplicationDbContext dbContext;

        public WishListController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("/wishlist/{id}")]
        public IActionResult AddToWishlist(long id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized("User not logged in.");

            var book = dbContext.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
                return NotFound("Book not found.");

            var existingWishlist = dbContext.WishLists
                .FirstOrDefault(w => w.BookId == id && w.UserId == userId);

            if (existingWishlist != null)
            {
                dbContext.WishLists.Remove(existingWishlist);
                dbContext.SaveChanges();
                return StatusCode(200,new
                {
                    success = true,
                    message = "Book removed from wishlist."
                });
            }
            else
            {
                var wishlist = new WishList
                {
                    BookId = id,
                    UserId = userId
                };

                dbContext.WishLists.Add(wishlist);
                dbContext.SaveChanges();
                return StatusCode(201, new
                {
                    success = true,
                    message = "Book added to wishlist."
                });
            }
        }

        [HttpGet("/wishlists")]
        public async Task<IActionResult> GetWishLists()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var wishLists = await dbContext.WishLists
                                          .Where(w => w.UserId == userId)
                                          .Include(w => w.Book)
                                          .ToListAsync();
            return Ok(wishLists);
        }

    }
}
