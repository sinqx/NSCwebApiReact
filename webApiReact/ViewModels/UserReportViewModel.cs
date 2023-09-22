using System.ComponentModel.DataAnnotations.Schema;
using webApiReact.Models;

namespace webApiReact.ViewModels
{
    public class UserReportViewModel
    {
        public bool? INDGR { get; set; }
        public bool? E001 { get; set; }
        public string? user_INSERT { get; set; }
        public DateTime? date_UPDATE { get; set; }
        public string? user_REVIEW { get; set; }
        public DateTime? date_REVIEW { get; set; }
        public int? IST_duration { get; set; }
        public int? CAPIExported { get; set; }
        public string? ComputerName { get; set; }
        public int? RENAME { get; set; }
        public int? TIP1 { get; set; }
        public string? adress { get; set; }
        public int? T_ON { get; set; }
        public string? F_I_O { get; set; }
        public int? K_NPO { get; set; }
        public int? TIP2 { get; set; }
        public int? TIP3 { get; set; }
        public int? p3 { get; set; }
        public int? p4 { get; set; }
        public int? p5 { get; set; }
        public int? p6 { get; set; }
        public int? p7 { get; set; }
        public int? p10 { get; set; }
        public int? P1 { get; set; }
        public bool? E002 { get; set; }
        public bool? E003 { get; set; }
        public char? Kvartal { get; set; }
    }

}
