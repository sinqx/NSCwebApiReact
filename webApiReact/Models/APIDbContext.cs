using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace webApiReact.Models
{
    public class APIDbContext : IdentityDbContext<User>
    {
        public APIDbContext(DbContextOptions<APIDbContext> option) : base(option)
        { 
        }

        public override DbSet<User> Users { get; set; }
        public DbSet<UserReport> UsersReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
            modelBuilder.Entity<UserReport>()
                .HasKey(e => new { e.GOD, e.K_PRED, e.Month });
            base.OnModelCreating(modelBuilder);
        }

    }

   internal class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(x => x.K_PRED).HasMaxLength(8);
        }
    }
}
