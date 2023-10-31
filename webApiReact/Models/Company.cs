using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace webApiReact.Models
{
    public class Company
    {
        [Key]
        [Required]
        [Column(TypeName = "bigint")]
        public int K_PRED { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? NAME { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? T_ZN { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? email { get; set; }

        [Column(TypeName = "bit")]
        public bool? contactDataChange { get; set; }

        [Column(TypeName = "bigint")]
        public long? K_NPU { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? adress { get; set; }

        [Column(TypeName = "bigint")]
        public long? FSOB { get; set; }

        [Column(TypeName = "bigint")]
        public long? KTPP { get; set; }

        [Column(TypeName = "bigint")]
        public long? KTP { get; set; }

        [Column(TypeName = "bigint")]
        public long? KTP1 { get; set; }

        [Column(TypeName = "bigint")]
        public long? KTP2 { get; set; }

        [Column(TypeName = "bigint")]
        public long? KTP3 { get; set; }

        [Required]
        [Column(TypeName = "varchar(10)")]
        public required string OKD_3 { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? F_I_O { get; set; }

        [Column(TypeName = "bigint")]
        public long? T_ON { get; set; }

        [Column(TypeName = "bigint")]
        public long? TIP1 { get; set; }

        [Column(TypeName = "bigint")]
        public long? TIP2 { get; set; }

        [Column(TypeName = "bigint")]
        public long? TIP3 { get; set; }

        [Column(TypeName = "bigint")]
        public long? GR { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? STATUS1 { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? STATUS2 { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? STATUS3 { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? STATUS4 { get; set; }

        [Column(TypeName = "nvarchar(262)")]
        public string? Expr1 { get; set; }
    }
}
