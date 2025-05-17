using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Helpers
{
    public class FindUserHelper
    {
        private readonly ApplicationDbContext dbContext;

        public FindUserHelper(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //public async Task<User> FindByEmailAsync(string email)
        //{
        //    //var user = 
        //    return await dbContext.Users.FirstOrDefault(u => u.Email == email);
        //}
    }
}
