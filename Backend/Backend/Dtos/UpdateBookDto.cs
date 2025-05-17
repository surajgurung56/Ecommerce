namespace Backend.Dtos
{
    public class UpdateBookDto
    {         
        public string Title { get; set; } = "";

        public string Author { get; set; } = "";

        public string ISBN { get; set; } = "";

        public long Stock { get; set; } = 0;

        public double Price { get; set; } = 0;

        public string Language { get; set; } = "";

        public string Genre { get; set; } = "";

        public DateOnly PublishedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

        public string PublicationName { get; set; } = "";

        public string Description { get; set; } = "";

        public String Format { get; set; } = "";

        public IFormFile? Image { get; set; }

        public int CategoryId { get; set; }

        public int? DiscountPercentage { get; set; } = null;

        public DateOnly? DiscountStartDate { get; set; } = null;

        public DateOnly? DiscountEndDate { get; set; } = null;

    }
}
