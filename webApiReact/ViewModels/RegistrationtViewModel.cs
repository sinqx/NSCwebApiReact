using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using webApiReact.Models;

namespace webApiReact.ViewModels
{
    public class RegistrationtViewModel
    {
        [Required]
        public int K_PRED { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string UserName { get; set; }


        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

}
