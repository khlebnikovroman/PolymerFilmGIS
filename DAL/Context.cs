using Microsoft.EntityFrameworkCore;


namespace Models
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ObjectOnMap> ObjectsOnMap { get; set; }
    }
}
