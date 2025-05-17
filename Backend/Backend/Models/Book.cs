using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.Models
{
    public class Book
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public long Stock { get; set; }
        public double Price { get; set; }
        public string Language { get; set; }
        public DateOnly PublishedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
        public string PublicationName { get; set; }
        public string Description { get; set; }
        public String Format { get; set; }
        public DateOnly AddedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
        public String ImageURL { get; set; }


        public int? DiscountPercentage { get; set; }

        public DateOnly? DiscountStartDate { get; set; }

        public DateOnly? DiscountEndDate { get; set; }

        public bool IsOnSale { get; set; } = false;




        // For Category
        public long CategoryId { get; set; }
        public Category Category { get; set; }

        // For Order Item
        [JsonIgnore]
        public List<OrderItem> OrderItem { get; set; }

        // For Cart
        [JsonIgnore]
        public List<Cart> Carts { get; set; }
        
        // For WishList
        [JsonIgnore]
        public List<WishList> WishLists { get; set; }

        // For Reviews
        public ICollection<Review> Reviews { get; set; }


        public Book() { }

        public Book(string title, string author, string isbn, long stock,
                   double price, string language, DateOnly publishedDate,
                   string publicationName, string description, String format,
                   DateOnly addedDate, String images)
        {
            Title = title;
            Author = author;
            ISBN = isbn;
            Stock = stock;
            Price = price;
            Language = language;
            PublishedDate = publishedDate;
            PublicationName = publicationName;
            Description = description;
            Format = format;
            AddedDate = addedDate;
            ImageURL = images;
        }
    }
}