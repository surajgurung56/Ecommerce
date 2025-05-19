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
    public class BannerController : Controller
    {
        public readonly ApplicationDbContext dbContext;

        public BannerController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/banner")]
        public async Task<ActionResult> CreateBanner([FromForm] BannerDto bannerDto)
        {
            string imageUrl = null;

            if (bannerDto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/banners");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(bannerDto.Image.FileName);
                var newFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await bannerDto.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/banners/{newFileName}";
            }

            var banner = new Banner
            {
                Heading = bannerDto.Heading,
                Message = bannerDto.Message,
                Link = bannerDto.Link,
                ImageUrl = imageUrl,
                StartDate = bannerDto.StartDate,
                EndDate = bannerDto.EndDate,
            };

            dbContext.Banners.Add(banner);
            await dbContext.SaveChangesAsync();

            return StatusCode(201, new
            {
                success = true,
                message = "Banner added successfully"
            });
        }


        [HttpGet("/banners")]
        public async Task<ActionResult> GetAllBanners()
        {
            var banners = await dbContext.Banners.ToListAsync();
            return Ok(new
            {
                success = true,
                data = banners
            });
        }



        [Authorize(Roles = "admin")]
        [HttpDelete("/banner/{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var banner = await dbContext.Banners.FirstOrDefaultAsync(c => c.Id == id);

            if (banner == null)
            {
                return NotFound("Banner announcement not found.");
            }

            dbContext.Banners.Remove(banner);
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Banner announcement removed successfully."
            });
        }


    }
}
