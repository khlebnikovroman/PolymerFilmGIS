using Microsoft.AspNetCore.Mvc;


namespace WebAppWithReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjectOnMapController : Controller
    {
        [HttpGet]
        public int Get()
        {
            return 1;
        }
    }
}
