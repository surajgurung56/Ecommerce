using System.Security.Claims;
using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("auth")]
    public class UserController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;
        public UserController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("/user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User is not logged in." });
            }

            var user = await dbContext.applicationUsers
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Name,
                    u.Email,
                    u.ContactNumber,
                    u.MembershipId,
                    u.Id
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            return Ok(new { success = true, user });
        }



    }
}
