using System.Text;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Services
{
    public class EmailServiceImpl : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly AdminSettings _adminSettings;

        public EmailServiceImpl(IOptions<EmailSettings> emailSettings, IOptions<AdminSettings> adminSettings)
        {
            _emailSettings = emailSettings.Value;
            _adminSettings = adminSettings.Value;
        }

        public async Task SendOrderClaimCodeAsync(ApplicationUser applicationUser, Order order, List<OrderItem> orderItems)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Pustak Pasal", _emailSettings.From));
                message.To.Add(MailboxAddress.Parse(applicationUser.Email));
                message.Subject = "Order Conformed";

                var billBuilder = new StringBuilder();
                billBuilder.AppendLine("<h3> Bill:</h3>");
                billBuilder.AppendLine("<table style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>");
                billBuilder.AppendLine("<thead>");
                billBuilder.AppendLine("<tr style='background-color: #f2f2f2;'>");
                billBuilder.AppendLine("<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Book</th>");
                billBuilder.AppendLine("<th style='border: 1px solid #ddd; padding: 8px; text-align: center;'>Qty</th>");
                billBuilder.AppendLine("<th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Price</th>");
                billBuilder.AppendLine("<th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Subtotal</th>");
                billBuilder.AppendLine("</tr>");
                billBuilder.AppendLine("</thead>");
                billBuilder.AppendLine("<tbody>");

                foreach (var item in orderItems)
                {
                    var bookTitle = item.Book?.Title ?? "Unknown Book";
                    var quantity = item.Quantity;
                    var price = item.Price;
                    var subtotal = quantity * price;

                    billBuilder.AppendLine("<tr>");
                    billBuilder.AppendLine($"<td style='border: 1px solid #ddd; padding: 8px;'>{System.Net.WebUtility.HtmlEncode(bookTitle)}</td>");
                    billBuilder.AppendLine($"<td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>{quantity}</td>");
                    billBuilder.AppendLine($"<td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{price}</td>");
                    billBuilder.AppendLine($"<td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{subtotal}</td>");
                    billBuilder.AppendLine("</tr>");
                }

                billBuilder.AppendLine("</tbody>");
                billBuilder.AppendLine("<tfoot>");
                billBuilder.AppendLine("<tr style='font-weight: bold; background-color: #f9f9f9;'>");
                billBuilder.AppendLine($"<td colspan='3' style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Total Amount:</td>");
                billBuilder.AppendLine($"<td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{order.TotalAmount:C}</td>");
                billBuilder.AppendLine("</tr>");
                billBuilder.AppendLine("</tfoot>");
                billBuilder.AppendLine("</table>");

                var emailBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif; '>
                <p>Dear {System.Net.WebUtility.HtmlEncode(applicationUser.Name)},</p>

                <p>Thank you for your recent order at <strong>Pustak Pasal</strong>.</p>

                <p>Your book is now ready for collection. Please present the following claim code at counter:</p>

                <p><strong>Claim Code:</strong> {System.Net.WebUtility.HtmlEncode(order.ClaimCode)}<br />

                <strong>Order Date:</strong> {order.OrderDate:MMMM dd, yyyy}</p>

                {billBuilder.ToString()}

                <p>Make sure to collect your order.</p>

                <p>Regards,<br />
                <strong>Pustak Pasal Team</strong></p>
            </body>
            </html>
        ";

                message.Body = new TextPart("html") { Text = emailBody };

                using var client = new MailKit.Net.Smtp.SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, false);
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new Exception($"Failed to send email: {ex.Message}", ex);
            }
        }



        public async Task SendOrderNotificationToAdmin(ApplicationUser ApplicationUser, Order Order, List<OrderItem> OrderItems)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Pustak Pasal", _emailSettings.From));
                message.To.Add(MailboxAddress.Parse(_adminSettings.Email));
                message.Subject = "Your Book Claim Code from Pustak Pasal";
                message.Body = new TextPart("plain")
                {
                    Text = $@"
                    Dear {_adminSettings.Email},

                    A new purchase has been done at Pustak Pasal.

                    The following are the order details:

                    📌 Claim Code: {Order.ClaimCode}
                     Total Amount: {Order.TotalAmount}
                     Order Date: {Order.OrderDate}

                    Regards,
                    Pustak Pasal Team
                    "
                };

                using var client = new MailKit.Net.Smtp.SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, false);
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new Exception($"Failed to send email: {ex.Message}", ex);
            }
        }
    }
}
