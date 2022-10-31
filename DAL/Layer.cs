using Models;


namespace DAL.Migrations
{
    public class Layer : BaseModel
    {
        public IEnumerable<ObjectOnMap> ObjectsOnMap { get; set; }
    }
}
