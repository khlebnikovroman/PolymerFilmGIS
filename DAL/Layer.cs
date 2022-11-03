using Models;


namespace DAL.Migrations
{
    public class Layer : BaseModel
    {
        public Guid AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public IEnumerable<ObjectOnMap> ObjectsOnMap { get; set; }
    }
}
