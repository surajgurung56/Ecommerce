namespace Backend.Dtos
{
    public class OrderItemResponseDto
    {
        public long Id { get; set; }
        public long Quantity { get; set; }
        public decimal Price { get; set; } = decimal.Zero;
        public long BookId { get; set; }
        public string BookTitle { get; set; } 
        public string BookAuthor { get; set; }
        public string imageURL { get; set; }
        public string isbn { get; set; }
        public bool IsReviewed { get; set; }
    }
}
