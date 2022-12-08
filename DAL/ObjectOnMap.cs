namespace DAL
{
    public class ObjectOnMap : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public double Lati { get; set; }
        public double Long { get; set; }
        public double Capacity { get; set; }
        public Guid? LayerId { get; set; }
        public virtual Layer? Layer { get; set; }
        public Guid AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
