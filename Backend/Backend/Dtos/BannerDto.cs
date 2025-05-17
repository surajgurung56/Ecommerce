namespace Backend.Dtos
{
    public class BannerDto
    {
        public string Heading { get; set; }
        public string Message { get; set; }
        public string Link { get; set; }
        public IFormFile Image { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
