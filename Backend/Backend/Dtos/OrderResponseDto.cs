namespace Backend.Dtos
{
    public class OrderResponseDto
    {
        public long Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateOnly OrderDate { get; set; }
        public string ClaimCode { get; set; }
        public string UserId { get; set; }
        public List<OrderItemResponseDto> OrderItems { get; set; } = new List<OrderItemResponseDto>();
    }
}
