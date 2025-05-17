using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Category
    {
        public long Id { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<Book> Books { get; set; }

        public Category()
        {

        }

        public Category(string Name)
        {
            this.Name = Name;
        }
    }
}
