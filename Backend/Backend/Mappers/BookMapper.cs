using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Mappers
{
    public class BookMapper
    {
        private readonly ApplicationDbContext _dbContext;

        public BookMapper(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Book ToBook(BookDto bookDto)
        {
            //return new Book(
            //    bookDto.Title,
            //    bookDto.Author,
            //    bookDto.ISBN,
            //    bookDto.Stock,
            //    bookDto.Price,
            //    bookDto.Language,
            //    bookDto.Genre,
            //    bookDto.PublishedDate,
            //    bookDto.PublicationName,
            //    bookDto.Description,
            //    bookDto.Format,
            //    DateOnly.FromDateTime(DateTime.Today),
            //    bookDto.Image
            //    );

            return new Book();
        }
    }
}