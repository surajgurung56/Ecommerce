using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Backend.Mappers;
using Backend.Models;

namespace Backend.Services
{
    public class UserServiceImpl : IUserService
    {
        private readonly UserMapper _userMapper;
        private readonly ApplicationDbContext _dbContext;

        public UserServiceImpl(UserMapper userMapper, ApplicationDbContext dbContext)
        {
            _userMapper = userMapper;
            _dbContext = dbContext;
        }

        public User Register(RegisterDto userDto)
        {
            User mappedUser = _userMapper.toUser(userDto);
            var newUser = _dbContext.Users.Add(mappedUser);
            _dbContext.SaveChanges();
            return newUser.Entity;
        }

        public User Login(LoginDto loginDto)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return new User();
            }

            if (user.Password != loginDto.Password)
            {
                return new User();
            }

            return user;
        }

    }
}
