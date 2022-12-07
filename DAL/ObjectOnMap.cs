namespace DAL
{
    public class ObjectOnMap : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public double Lati { get; set; }
        public double Long { get; set; }
        public double Capacity { get; set; }
        public Guid AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
