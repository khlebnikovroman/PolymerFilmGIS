using System.Text;

using DAL;

using Mapster;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using WebAppWithReact.Features.GoodCities;
using WebAppWithReact.Features.Layer;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Features.ObjectOnMap;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
string connectionString;

if (env == "Production")
{
    connectionString = Environment.GetEnvironmentVariable("PRODUCION_BASE");
    var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
    configuration["JWT:Secret"] = secret;
}
else
{
    connectionString = configuration.GetConnectionString("DevConnection");
}


builder.Services.AddDbContext<Context>(options =>
{
    options.UseLazyLoadingProxies()
           .UseSqlServer(connectionString);
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddSqlServer<Context>(connectionString);

// For Identity
builder.Services.AddIdentity<AppUser, IdentityRole<Guid>>()
       .AddEntityFrameworkStores<Context>()
       .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
       {
           options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
           options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
           options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
       })
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

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "JWTToken_Auth_API", Version = "v1",
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description =
            "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                },
            },
            new string[] { }
        },
    });
});

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(EFGenericRepository<>));
builder.Services.AddTransient<ObjectOnMapService>();
builder.Services.AddTransient<LayerService>();
builder.Services.AddTransient<IGoodCitiesService, GoodCitiesService>();


TypeAdapterConfig<GetLayerDto, Layer>
    .NewConfig()
    .TwoWays()
    .Map(x => x.ObjectsOnMap, x => x.Objects);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<Context>();
        dbContext.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapDefaultControllerRoute();
app.Run();
