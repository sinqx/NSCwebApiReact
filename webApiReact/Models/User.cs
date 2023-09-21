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

        [ForeignKey("UserUIDCode")]
        public virtual UserUID? UserUID { get; set; }

        public virtual ICollection<UserReport>? UserReports { get; set; }
    }
}
