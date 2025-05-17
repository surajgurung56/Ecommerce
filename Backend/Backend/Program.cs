using System.Text;
using Backend.Data;
using Backend.Interfaces;
using Backend.Mappers;
using Backend.Models;
using Backend.Seed;
using Backend.Services;
using Backend.Socket.Backend.Sockets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// For Cors error
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Postgres connection string
var dbConnection = builder.Configuration.GetConnectionString("PostgresConnection");

// Auto Mapper
builder.Services.AddAutoMapper(typeof(Program));

// Identitty framework config
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<TokenService>();

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
        ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
        ValidAudience = builder.Configuration["JwtConfig:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Secret"]))
    };
});

// Swagger config
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Your API", Version = "v1" });

    // Add JWT Bearer Authorization
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\nExample: \"Bearer abcdefgh123456\""
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Services
builder.Services.AddScoped<IUserService, UserServiceImpl>();
builder.Services.AddScoped<IBookService, BookServiceImpl>();
builder.Services.AddScoped<ICategoryService, CategoryServiceImpl>();

// Mappers
builder.Services.AddScoped<UserMapper>();
builder.Services.AddScoped<BookMapper>();

// Email config
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<AdminSettings>(builder.Configuration.GetSection("AdminSettings"));
builder.Services.AddTransient<IEmailService, EmailServiceImpl>();

// For postgres
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseNpgsql(dbConnection)
);

var app = builder.Build();

// Seed admin
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedAdmin.SeedAdminUserAsync(services);
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowAll");

// For Web Socket
app.UseWebSockets();
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var handler = new WebSocketHandler();
        await handler.HandleAsync(webSocket, CancellationToken.None);
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

app.UseHttpsRedirection();

app.MapControllers();

app.UseStaticFiles();

app.Run();
