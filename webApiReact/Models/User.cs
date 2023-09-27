using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webApiReact.Models
{
    public class User : IdentityUser
    {
        [Required]
        [Key]
        public override string Id { get; set; }

        [Column(TypeName = "char(8)")]
        public string K_PRED { get; set; }

        [Required]
        public override string Email { get; set; }

        [Required]
        public override string UserName { get; set; }

        public virtual ICollection<UserReport>? UserReports { get; set; }
    }
}
