using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Models;


namespace WebAppWithReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjectOnMapController : Controller
    {
        private readonly Context db;

        public ObjectOnMapController(Context context)
        {
            db = context;
        }

        [HttpGet]
        public async Task<IReadOnlyCollection<ObjectOnMap>> Get()
        {
            await db.ObjectsOnMap.LoadAsync();
            var l = db.ObjectsOnMap.Local.ToList();

            return l;
        }
    }
}
