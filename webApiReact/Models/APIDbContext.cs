using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace webApiReact.Models
{
    public class APIDbContext : IdentityDbContext<User>
    {
        public APIDbContext(DbContextOptions<APIDbContext> option) : base(option)
        { 
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserUID> UsersUIDs { get; set; }
        public DbSet<UserReport> UsersReports { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserReport>()
                .HasKey(e => new { e.GOD, e.K_PRED, e.Month });
            base.OnModelCreating(modelBuilder);
        }

    }
}
