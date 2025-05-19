using System.Security.Claims;
using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Backend.Controllers
{
    [ApiController]
    [Route("auth")]
    public class UserController : ControllerBase
    {
        public readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public UserController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.dbContext = dbContext;
            _userManager = userManager;
        }


        [Authorize]
        [HttpGet("/user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { success = false, message = "User is not logged in." });
            }

            var user = await dbContext.applicationUsers
                 .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                success = true,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.ContactNumber,
                    user.MembershipId,
                    Roles = roles
                }
            });
        }



    }
}
