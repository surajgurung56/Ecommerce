using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string ContactNumber { get; set; }

        public string Password { get; set; }

        public Guid MembershipId { get; set; }

        public User()
        {

        }

        public User(string Name, string Email, string ContactNumber, string Password, Guid MembershipId)
        {
            this.Name = Name;
            this.Email = Email;
            this.ContactNumber = ContactNumber;
            this.Password = Password;
            this.MembershipId = MembershipId;
        }

    }
}
