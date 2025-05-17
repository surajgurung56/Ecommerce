using Backend.Dtos.Auth;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        User Register(RegisterDto userDto);

        User Login(LoginDto loginDto);
    }
}
