using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Interfaces
{
    public interface ICategoryService
    {
        Category AddCategory(CategoryDto categoryDto);

        Task<List<Category>> GetAllCategories();

        Task<Category> GetCategory(long categoryId);

        Task<Category> UpdateCategoryAsync(long id, CategoryDto categoryDto);

        Task<bool> DeleteCategoryAsync(long id);

    }
}
