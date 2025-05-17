namespace Backend.Dtos.Auth
{
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string Password { get; set; }

        public RegisterDto() { }

        public RegisterDto(string Name, string Email, string ContactNumber, string Password)
        {
            this.Name = Name;
            this.Email = Email;
            this.ContactNumber = ContactNumber;
            this.Password = Password;
        }

    }
}
