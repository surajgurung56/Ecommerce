using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Backend.Seed
{
    public static class SeedAdmin
    {
        public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("SeedAdmin");

            var emailSettings = serviceProvider.GetRequiredService<IOptions<EmailSettings>>().Value;
            var adminSettings = serviceProvider.GetRequiredService<IOptions<AdminSettings>>().Value;

            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string adminRole = adminSettings.Role;
            string adminName = adminSettings.Name;
            string adminEmail = adminSettings.Email;
            string adminContact = adminSettings.Contact;
            string adminPassword = adminSettings.Password;

            try
            {
                if (!await roleManager.RoleExistsAsync(adminRole))
                    await roleManager.CreateAsync(new IdentityRole(adminRole));

                var userExists = await userManager.FindByNameAsync(adminEmail);
                if (userExists != null)
                {
                    logger.LogInformation("Admin user already exists.");
                    throw new Exception("adminEmail: " + adminEmail);
                }

                var adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Name = adminName,
                    ContactNumber = adminContact,
                    MembershipId = Guid.NewGuid(),
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                    logger.LogInformation("Admin user created.");
                }
                else
                {
                    logger.LogError("Failed to create admin user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding admin user.");
            }
        }
    }
}
