using Backend.Dtos;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IBookService
    {
        Book AddBook(BookDto book);
        Task<List<Book>> GetAllBooks();
        Task<Book> GetBook(int id);
        Task<bool> DeleteBookAsync(long id);
    }
}
