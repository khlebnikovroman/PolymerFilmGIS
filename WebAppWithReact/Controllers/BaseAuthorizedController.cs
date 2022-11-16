using DAL;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Extensions;


namespace WebAppWithReact.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public abstract class BaseAuthorizedController : ControllerBase
{
    public bool IsUserAdmin => User.IsInRole(UserRoles.Admin);
    protected Guid UserId => User.GetLoggedInUserId<Guid>();
}
