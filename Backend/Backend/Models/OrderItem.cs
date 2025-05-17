using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class OrderItem
    {
        public long Id { get; set; }

        public long Quantity { get; set; }

        public decimal Price { get; set; } = decimal.Zero;

        public long? BookId { get; set; }
        public Book Book { get; set; }

        public long? OrderId { get; set; }

        [JsonIgnore]
        public Order Order { get; set; }

    }
}
