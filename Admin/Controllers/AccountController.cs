using DAL;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Admin.Controllers;

public class AccountController : Controller
{
    private readonly SignInManager<AppUser> _signInManager;

    public AccountController(SignInManager<AppUser> signInManager)
    {
        _signInManager = signInManager;
    }

    [HttpGet]
    public IActionResult Login(string returnUrl = null)
    {
        if (User.IsInRole(UserRoles.Admin))
        {
            return Redirect("/CoreAdmin");
        }

        return View(new LoginViewModel
        {
            /*ReturnUrl = returnUrl*/
        });
    }

    [HttpGet]
    public IActionResult AdminPage()
    {
        if (User.IsInRole(UserRoles.Admin))
        {
            return Redirect("/CoreAdmin");
        }

        return RedirectToAction(nameof(Login));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, true, false);

            if (result.Succeeded)
            {
                return RedirectToAction("AdminPage", "Account");
            }

            ModelState.AddModelError("", "Неправильный логин и (или) пароль");
        }

        return View(model);
    }
}
