namespace Backend.Models
{
    public class Order
    {
        public long Id { get; set; }

        public decimal TotalAmount { get; set; }

        public String Status { get; set; }

        public DateOnly OrderDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

        public String ClaimCode { get; set; } = Guid.NewGuid().ToString();

        public String? UserId { get; set; }

        //[JsonIgnore]
        public ApplicationUser applicationUser { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }

    }
}
