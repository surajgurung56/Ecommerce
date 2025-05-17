using Backend.Dtos.Auth;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            Console.WriteLine("Name is 1 : " + registerDto.Name);
            Console.WriteLine("Password is 1 : " + registerDto.Password);

            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid request"
                });
            }

            var userExists = await _userManager.FindByNameAsync(registerDto.Email);
            if (userExists != null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User already exists"
                });
            }

            var user = new ApplicationUser
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                UserName=registerDto.Email,
                ContactNumber=registerDto.ContactNumber,
                MembershipId = Guid.NewGuid()
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            if (!await _roleManager.RoleExistsAsync("member"))
            {
                await _roleManager.CreateAsync(new IdentityRole("member"));
            }

            // Add user to Customer role
            await _userManager.AddToRoleAsync(user, "member");

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Member created successfully"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid request."
                });
            }

            var user = await _userManager.FindByNameAsync(registerDto.Email);
            if (user == null)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid username or password."
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, registerDto.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid username or password."
                });
            }

            var token = await _tokenService.GenerateToken(user);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Token = token,
                Id = user.Id,
                UserName = user.Name,
                Email = user.Email,
                Message = "Login successful",
                Roles = roles.ToList()
            });
        }




    }
}
