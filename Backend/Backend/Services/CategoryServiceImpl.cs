using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class CategoryServiceImpl : ICategoryService
    { 
        private readonly ApplicationDbContext dbContext;

        public CategoryServiceImpl(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public Category AddCategory(CategoryDto categoryDto)
        {
            var newCategory = dbContext.Categories.Add(new Category()
            {
                Name = categoryDto.Name,
            });

            dbContext.SaveChanges();

            return newCategory.Entity;

        }


        public async Task<Category> GetCategory(long categoryId)
        {
            var category = await dbContext.Categories.FindAsync(categoryId);

            return category;
        }



        public async Task<List<Category>> GetAllCategories()
        {
            return await dbContext.Categories.ToListAsync();
        }

        public async Task<Category> UpdateCategoryAsync(long id, CategoryDto categoryDto)
        {
            if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            {
                throw new ArgumentException("Invalid category data.");
            }

            var existingCategory = await dbContext.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.Name = categoryDto.Name;
            dbContext.Categories.Update(existingCategory);
            await dbContext.SaveChangesAsync();

            return existingCategory;
        }

        public async Task<bool> DeleteCategoryAsync(long id)
        {
            var category = await dbContext.Categories
                .Include(c => c.Books)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return false;

            // Check if the category has any associated books
            if (category.Books.Any())
            {
                throw new InvalidOperationException("Cannot delete the category because it is associated with one or more books.");
            }

            // Remove the category
            dbContext.Categories.Remove(category);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}
