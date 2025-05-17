using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string ContactNumber { get; set; }

        public Guid MembershipId { get; set; }

        // Order
        [JsonIgnore]
        public List<Order> Order { get; set; }

        // For Cart
        public List<Cart> Carts { get; set; }
        
        // For WishList
        public List<WishList> WishLists { get; set; }

        // For Reviews
        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; }


        public ApplicationUser()
        {

        }

        //public ApplicationUser(string Name, string Email, string ContactNumber, string Password, string Role, Guid MembershipId)
        //{
        //    this.Name = Name;
        //    this.Email = Email;
        //    this.ContactNumber = ContactNumber;
        //    //this.Password = Password;
        //    this.Role = Role;
        //    this.MembershipId = MembershipId;
        //}
    }
}
