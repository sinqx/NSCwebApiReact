using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webApiReact.Models
{
    public class UserUID
    {
        [Key]
        public int Code { get; set; }

        [Required]
        [Column(TypeName = "varchar(30)")]
        public string? PositionName { get; set; }

        public virtual ICollection<User>? User { get; set; }
    }
}
