using System.ComponentModel.DataAnnotations;


namespace Admin.Controllers;

public class LoginViewModel
{
    [Required(ErrorMessage = "Обязательное поле")]
    [Display(Name = "Имя пользователя")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Обязательное поле")]
    [DataType(DataType.Password)]
    [Display(Name = "Пароль")]
    public string Password { get; set; }
}
