namespace Backend.Dtos.Review
{
    public class AddReviewDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }

        public int OrderItemId { get; set; }
    }
}
