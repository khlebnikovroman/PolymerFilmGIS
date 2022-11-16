using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace DAL
{
    public class Context : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<ObjectOnMap> ObjectsOnMap { get; set; }
        public DbSet<Layer> Layers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var user1 = new AppUser
                {Id = Guid.NewGuid(), FirstName = "Vasya", SecondName = "Petrov",};

            modelBuilder.Entity<AppUser>().HasData(user1);

            modelBuilder.Entity<ObjectOnMap>().HasData(new ObjectOnMap
            {
                Id = Guid.NewGuid(),
                Capacity = 1000,
                Lati = 50,
                Long = 50,
                Name = "Тест данные Vasya petrov",

                //AppUser =  user1,
                AppUserId = user1.Id,
            });
        }
    }
}
