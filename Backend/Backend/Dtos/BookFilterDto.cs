namespace Backend.Dtos
{
    public class BookFilterDto
    {
        public List<long> Categories { get; set; } = new();
        public List<string> Formats { get; set; } = new();
    }
}
