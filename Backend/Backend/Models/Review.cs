using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Review
    {
        public long Id { get; set; }

        // Foreign key for Book
        public long BookId { get; set; }

        [JsonIgnore]
        public Book Book { get; set; }

        // Foreign key for ApplicationUser
        public string UserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

   

        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
