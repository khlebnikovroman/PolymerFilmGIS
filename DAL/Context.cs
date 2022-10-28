using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Models
{
    public class Context : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<ObjectOnMap> ObjectsOnMap { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>().HasData(new AppUser
                                                       {Id = Guid.NewGuid(), FirstName = "Vasya", SecondName = "Petrov",});

            modelBuilder.Entity<ObjectOnMap>().HasData(new ObjectOnMap
                                                           {Id = Guid.NewGuid(), Capacity = 1000, Lati = 50, Long = 50, Name = "Тест данные",});
        }
    }
}
