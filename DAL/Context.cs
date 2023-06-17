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
        public DbSet<UserSettings> UsersSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                        .HasOne(u => u.UserSettings)
                        .WithOne(s => s.AppUser)
                        .HasForeignKey<UserSettings>(s => s.AppUserId);

            // modelBuilder.Entity<Layer>()
            //             .HasMany(c => c.ObjectsOnMap)
            //             .WithOne(e => e.Layer)
            //             .HasForeignKey(p=>p.LayerId)
            //             .IsRequired(false)
            //             .OnDelete(DeleteBehavior.SetNull);
            // modelBuilder.Entity<ObjectOnMap>()
            //             .HasOne(c => c.Layer)
            //             .WithMany(c=> c.ObjectsOnMap)
            //             .IsRequired(false)
            //             .HasForeignKey(p=>p.LayerId)
            //             .OnDelete(DeleteBehavior.SetNull);
            var user1 = new AppUser
                {Id = Guid.NewGuid(), FirstName = "Vasya", SecondName = "Petrov",};

            // modelBuilder.Entity<AppUser>().HasData(user1);
            //
            // modelBuilder.Entity<ObjectOnMap>().HasData(new ObjectOnMap
            // {
            //     Id = Guid.NewGuid(),
            //     Capacity = 1000,
            //     Lati = 50,
            //     Long = 50,
            //     Name = "Тест данные Vasya petrov",
            //
            //     //AppUser =  user1,
            //     AppUserId = user1.Id,
            // });
        }
    }
}
