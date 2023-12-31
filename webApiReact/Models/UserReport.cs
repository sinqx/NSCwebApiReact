﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace webApiReact.Models
{
    public class UserReport
    {

        [Required]
        [Column(TypeName = "char(4)")]
        public int GOD { get; set; }

        [Required]
        [Column(TypeName = "char(1)")]
        public char Kvaratl { get; set; }

        [Required]
        [Column(TypeName = "char(8)")]
        public int K_PRED { get; set; }

        [Column(TypeName = "bit")]
        public bool? INDGR { get; set; }

        [Column(TypeName = "bit")]
        public bool? E001 { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? user_INSERT { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? date_UPDATE { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string? user_REVIEW { get; set; }

        [Column(TypeName = "dateTime")]
        public DateTime? date_REVIEW { get; set; }

        [Column(TypeName = "int")]
        public int? IST_duration { get; set; }

        [Column(TypeName = "smallint")]
        public int? CAPIExported { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? ComputerName { get; set; }

        public int? RENAME { get; set; }
        public int? TIP1 { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? adress { get; set; }

        [Column(TypeName = "bigint")]
        public long? T_ON { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string? F_I_O { get; set; }

        [Column(TypeName = "bigint")]
        public long? K_NPO { get; set; }

        public int? TIP2 { get; set; }

        public int? TIP3 { get; set; }


        [Column(TypeName = "bigint")]
        public long? P1 { get; set; }

        [Column(TypeName = "bigint")]
        public long? P2 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p3 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p4 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p5 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p6 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p7 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p8 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p9 { get; set; }

        [Column(TypeName = "bigint")]
        public long? p10 { get; set; }

        [Column(TypeName = "bit")]
        public bool? E002 { get; set; }

        [Column(TypeName = "bit")]
        public bool? E003 { get; set; }

        [JsonIgnore]
        public virtual User? User { get; set; }
    }
}
