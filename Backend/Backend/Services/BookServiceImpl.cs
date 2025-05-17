using Backend.Data;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Mappers;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BookServiceImpl : IBookService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly BookMapper _bookMapper;
        
        public BookServiceImpl(ApplicationDbContext dbContext, BookMapper bookMapper) 
        { 
            this.dbContext = dbContext;
            this._bookMapper = bookMapper;
        }

        public Book AddBook(BookDto bookDto)
        {
            Book book = _bookMapper.ToBook(bookDto);
            var newBook = dbContext.Books.Add(book);
            dbContext.SaveChanges();

            return newBook.Entity;
        }

        public async Task<List<Book>> GetAllBooks()
        {
            return await dbContext.Books
                .Include(b => b.Category)
                .ToListAsync();
        }

        public async Task<Book> GetBook(int id)
        {
            return await dbContext.Books
                .Include(b => b.Category)
                .Include(b => b.Reviews)
                    .ThenInclude(r => r.ApplicationUser)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<bool> DeleteBookAsync(long id)
        {
            var book = await dbContext.Books
                .Include(b => b.Carts)
                .Include(b => b.WishLists)
                .Include(b => b.OrderItem)
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return false;

            // Check if the book is associated with any carts, wish lists, order items, or reviews
            if (book.Carts.Any() || book.WishLists.Any() || book.OrderItem.Any() || book.Reviews.Any())
            {
                throw new InvalidOperationException("Cannot delete the book because it is associated with carts, wishlists, orders or reviews.");
            }
             
            dbContext.Books.Remove(book);
            await dbContext.SaveChangesAsync();
            return true;
        }

    }
}
