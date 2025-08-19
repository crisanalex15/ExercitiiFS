using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Parola este obligatorie")]
        [MinLength(6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere")]
        public string Password { get; set; }

        public bool RememberMe { get; set; } = false;
    }

    public class RegisterDto
    {
        [Required(ErrorMessage = "Email este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Parola este obligatorie")]
        [MinLength(6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirmarea parolei este obligatorie")]
        [Compare("Password", ErrorMessage = "Parolele nu se potrivesc")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Numele este obligatoriu")]
        [StringLength(100, ErrorMessage = "Numele trebuie să aibă maximum 100 de caractere")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Prenumele este obligatoriu")]
        [StringLength(100, ErrorMessage = "Prenumele trebuie să aibă maximum 100 de caractere")]
        public string LastName { get; set; }
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
        public DateTime? TokenExpiration { get; set; }
        public UserInfoDto User { get; set; }
    }

    public class UserInfoDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }

    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Parola curentă este obligatorie")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "Noua parolă este obligatorie")]
        [MinLength(6, ErrorMessage = "Noua parolă trebuie să aibă cel puțin 6 caractere")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirmarea noii parole este obligatorie")]
        [Compare("NewPassword", ErrorMessage = "Parolele nu se potrivesc")]
        public string ConfirmNewPassword { get; set; }
    }

    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "Email este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Email este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Token-ul este obligatoriu")]
        public string Token { get; set; }

        [Required(ErrorMessage = "Noua parolă este obligatorie")]
        [MinLength(6, ErrorMessage = "Noua parolă trebuie să aibă cel puțin 6 caractere")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirmarea parolei este obligatorie")]
        [Compare("NewPassword", ErrorMessage = "Parolele nu se potrivesc")]
        public string ConfirmPassword { get; set; }
    }
}
