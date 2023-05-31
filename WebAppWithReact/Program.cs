using System.Collections;
using System.Text;

using DAL;

using Mapster;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using WebAppWithReact.Features.Layer;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Features.ObjectOnMap;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
// For Entity Framework
foreach (DictionaryEntry VARIABLE in Environment.GetEnvironmentVariables())
{
    Console.WriteLine(VARIABLE.Key + ": " + VARIABLE.Value);
}

var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
Console.WriteLine(env);
string connectionString, jwtSecret;

if (env == "Production")
{
    connectionString = Environment.GetEnvironmentVariable("PRODUCION_BASE");
    jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
    Console.WriteLine($"con: {connectionString}");
    Console.WriteLine($"jwt: {jwtSecret}");
}
else
{
    connectionString = configuration.GetConnectionString("DevConnection");
    jwtSecret = configuration["JWT:Secret"];
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
               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
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

builder.Services.AddCoreAdmin(UserRoles.Admin);
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

// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapDefaultControllerRoute();
app.Run();
