using System.Security.Claims;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("/api")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("/category")]
        public ActionResult<Category> AddCategory(CategoryDto categoryDto) 
        {
            var addedCategory = _categoryService.AddCategory(categoryDto);

            return Ok(new
            {
                success = true,
                message = "Gerna added successfully",
                data = addedCategory
            });
        }

        [HttpGet("/categories")]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            return Ok(await this._categoryService.GetAllCategories());
        }


        [HttpGet("/category/{categoryId}")]
        public async Task<IActionResult> GetCategory(long categoryId)
        {
            var category = await _categoryService.GetCategory(categoryId);

            if (category == null)
            {
                return NotFound(new { success = false, message = "Category not found." });
            }

            return Ok(new
            {
                success = true,
                data = category
            });
        }



        [HttpPut("/category/{id}")]
        public async Task<IActionResult> UpdateCategory(long id, [FromBody] CategoryDto categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateCategoryAsync(id, categoryDto);

            if (updatedCategory == null)
            {
                return NotFound(new {Success= false, Message = $"Category with ID {id} not found."});
            }
            return Ok(new { Success = true, data = updatedCategory }); 
        }

        [HttpDelete("/category/{id}")]
        public async Task<IActionResult> DeleteCategory(long id)
        {
            try
            {
                var successStatus = await _categoryService.DeleteCategoryAsync(id);

                if (!successStatus)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Category not found."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Category deleted successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An unexpected error occurred.", error = ex.Message });
            }
        }

    }
}
