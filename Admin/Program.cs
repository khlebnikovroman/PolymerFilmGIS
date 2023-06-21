using DAL;

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);


string connectionString;

var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

if (env == "Production")
{
    connectionString = Environment.GetEnvironmentVariable("PRODUCION_BASE");
    var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DevConnection");
}

// Add services to the container.


builder.Services.AddDbContext<Context>(options =>
                                           options.UseSqlServer(connectionString));

builder.Services.AddControllersWithViews();

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentity<AppUser, IdentityRole<Guid>>()
       .AddRoles<IdentityRole<Guid>>()
       .AddEntityFrameworkStores<Context>()
       .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).AddCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.Cookie.MaxAge = options.ExpireTimeSpan; // optional
    options.SlidingExpiration = true;
});

builder.Services.AddAuthorization();
builder.Services.AddRazorPages();
builder.Services.AddCoreAdmin(UserRoles.Admin);
var app = builder.Build();
app.UsePathBase("/adminpage");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");

    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCoreAdminCustomTitle("Панель администратора");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapDefaultControllerRoute();

app.MapControllerRoute("default",
                       "{controller=Account}/{action=Login}/{id?}");


app.Run();
