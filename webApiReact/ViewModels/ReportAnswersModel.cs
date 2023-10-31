using System.ComponentModel.DataAnnotations.Schema;

namespace webApiReact.ViewModels
{
    public class ReportAnswersModel
    {
        public required int GOD { get; set; }

        public required char Kvaratl { get; set; }

        public required int K_PRED { get; set; }

        public long? P0 { get; set; }
        public long? P1 { get; set; }
        public long? P2 { get; set; }
        public long? p3 { get; set; }
        public long? p4 { get; set; }
        public long? p5 { get; set; }
        public long? p6 { get; set; }
        public long? p7 { get; set; }
        public long? p8 { get; set; }
        public long? p9 { get; set; }
        public long? p10 { get; set; }
    }
}
