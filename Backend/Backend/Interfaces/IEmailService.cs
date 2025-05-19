using Backend.Models;

namespace Backend.Interfaces
{
    public interface IEmailService            
    {
        Task SendOrderClaimCodeAsync(ApplicationUser ApplicationUser, Order Order, List<OrderItem> OrderItems);
        Task SendOrderNotificationToAdmin(ApplicationUser ApplicationUser, Order Order, List<OrderItem> OrderItems);
    }
}
