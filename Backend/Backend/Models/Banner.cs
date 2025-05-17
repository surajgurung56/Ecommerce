namespace Backend.Models
{
    public class Banner
    {
        public int Id { get; set; }                 
        public string Heading { get; set; }          
        public string Message { get; set; }          
        public string Link { get; set; }           
        public string ImageUrl { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
