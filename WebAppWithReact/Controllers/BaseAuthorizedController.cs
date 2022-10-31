using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace WebAppWithReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public abstract class BaseAuthorizedController : ControllerBase
    {
        public Guid UserId
        {
            get
            {
                return !User.Identity.IsAuthenticated
                           ? Guid.Empty
                           : Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            }
        }
    }
}
