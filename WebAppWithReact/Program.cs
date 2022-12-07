using System.Text;

using DAL;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using WebAppWithReact.Features.Layer;
using WebAppWithReact.Features.ObjectOnMap;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
// For Entity Framework
builder.Services.AddDbContext<Context>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHttpContextAccessor();

// For Identity
builder.Services.AddIdentity<AppUser, IdentityRole<Guid>>()
       .AddEntityFrameworkStores<Context>()
       .AddDefaultTokenProviders();

// Adding Authentication
builder.Services.AddAuthentication(options =>
       {
           options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
           options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
           options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
       })

       // Adding Jwt Bearer
       .AddJwtBearer(options =>
       {
           options.SaveToken = true;
           options.RequireHttpsMetadata = false;

           options.TokenValidationParameters = new TokenValidationParameters
           {
               ValidateIssuer = true,
               ValidateAudience = true,
               ValidateLifetime = true,
               ValidateIssuerSigningKey = true,
               ClockSkew = TimeSpan.Zero,


               ValidAudience = configuration["JWT:ValidAudience"],
               ValidIssuer = configuration["JWT:ValidIssuer"],
               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])),
           };
       });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Policies.IsObjectOwnByUser, policy =>
    {
        policy.AddRequirements(new OwnByUserRequirement());
    });
});

builder.Services.AddSingleton<IAuthorizationHandler, OwnByUserHandler>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(EFGenericRepository<>));
builder.Services.AddTransient<ObjectOnMapService>();
builder.Services.AddTransient<LayerService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.


app.UseHttpsRedirection();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
