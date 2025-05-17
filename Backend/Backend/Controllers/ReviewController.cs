using Microsoft.AspNetCore.Mvc;
using Backend.Dtos.Review;
using Backend.Models;
using System.Security.Claims;
using Backend.Data;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;

        public ReviewController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("/review/{bookId}")]
        public async Task<IActionResult> CreateReview(long bookId, [FromBody] AddReviewDto reviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User is not logged in." });
            }

            var review = new Review
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                BookId = bookId,
                UserId = userId
            };

            dbContext.Reviews.Add(review);
            await dbContext.SaveChangesAsync();

            return Ok(new { success = true, message = "Review created successfully", review });
        }
    }
}
