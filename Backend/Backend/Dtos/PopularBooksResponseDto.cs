using Backend.Models;

namespace Backend.Dtos
{
    public class PopularBooksResponseDto
    {
        public Book Book { get; set; }
        public long TotalOrderedQuantity { get; set; }
    }
}
