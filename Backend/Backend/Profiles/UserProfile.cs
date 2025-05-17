using AutoMapper;
using Backend.Dtos.Auth;
using Backend.Models;

namespace Backend.Profiles
{
    public class UserProfile :Profile
    {
        public UserProfile()
        {
            // Source -> Destination
            CreateMap<User, RegisterDto>();
            CreateMap<RegisterDto, User>();
        }
    }
}
