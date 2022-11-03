using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Models;


namespace WebAppWithReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseAuthorizedController : ControllerBase
    {
        public bool IsUserAdmin
        {
            get
            {
                return User.IsInRole(UserRoles.Admin);
            }
        }
    }
}
