using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class WishList
    {
        [Key]
        public long Id { get; set; }

        public long? BookId { get; set; }

        public Book Book { get; set; }

        [JsonIgnore]
        public String? UserId { get; set; }

        [JsonIgnore]
        public ApplicationUser applicationUser { get; set; }
    }
}
