using Backend.Dtos.Auth;
using Backend.Enums;
using Backend.Models;

namespace Backend.Mappers
{
    public class UserMapper
    {
        public UserMapper() 
        {

        }

        public User toUser(RegisterDto userDto) {
            return new User()
            {
                Name = userDto.Name,
                Email = userDto.Email,
                ContactNumber = userDto.ContactNumber,
                Password = userDto.Password,
                MembershipId = Guid.NewGuid(),
            };
        }
    }
}
