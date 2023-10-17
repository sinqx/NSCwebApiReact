﻿using System.ComponentModel.DataAnnotations.Schema;

namespace webApiReact.ViewModels
{
    public class ReportAnswersModel
    {
        public required int GOD { get; set; }

        public required char Kvaratl { get; set; }

        public required int K_PRED { get; set; }

        public int? P0 { get; set; }
        public int? P1 { get; set; }
        public int? P2 { get; set; }
        public int? p3 { get; set; }
        public int? p4 { get; set; }
        public int? p5 { get; set; }
        public int? p6 { get; set; }
        public int? p7 { get; set; }
        public int? p8 { get; set; }
        public int? p9 { get; set; }
        public int? p10 { get; set; }
    }
}
