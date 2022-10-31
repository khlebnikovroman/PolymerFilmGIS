using Models;


namespace WebAppWithReact.Misc
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser appUser);
    }
}
