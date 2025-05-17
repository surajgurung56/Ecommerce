using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ApplicationUser> applicationUsers { get; set; }        
        public DbSet<Cart> Carts { get; set; }
        public DbSet<WishList> WishLists { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>()
           .HasOne(b => b.Category)             
           .WithMany(c => c.Books)             
           .HasForeignKey(b => b.CategoryId)   
           .OnDelete(DeleteBehavior.Cascade);

            // One-to-One: ApplicationUser - Order
            modelBuilder.Entity<Order>()
                .HasOne(o => o.applicationUser)
                .WithMany(u => u.Order)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Order - OrderItems
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: OrderItem - Book
            modelBuilder.Entity<OrderItem>()
           .HasOne(oi => oi.Book)  
           .WithMany(b => b.OrderItem)  
           .HasForeignKey(oi => oi.BookId)
           .OnDelete(DeleteBehavior.Cascade);

            // ApplicationUser - Cart (One-to-Many)
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.applicationUser)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Book - Cart (One-to-Many)
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Book)
                .WithMany(b => b.Carts)
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // ApplicationUser - WisghList (One-to-Many)
            modelBuilder.Entity<WishList>()
                .HasOne(w => w.applicationUser)
                .WithMany(u => u.WishLists)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Book - WishList (One-to-Many)
            modelBuilder.Entity<WishList>()
                .HasOne(w => w.Book)
                .WithMany(b => b.WishLists)
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // Book - Review (One-to-Many)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // ApplicationUser - Review (One-to-Many)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.ApplicationUser)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
