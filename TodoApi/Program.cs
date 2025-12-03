using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TodoApi;
using DotNetEnv;
using System.Diagnostics;


if (File.Exists(".env"))
    Env.Load();
var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("TODODB_CONNECTION");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'TODODB_CONNECTION' not found. Please ensure the .env file exists and is loaded.");
}

var key = Environment.GetEnvironmentVariable("JWT_KEY");
if (string.IsNullOrEmpty(key))
{
    throw new InvalidOperationException("JWT key 'JWT_KEY' not found. Please ensure the .env file exists and is loaded.");
}

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString,
    ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


string GenerateJwtToken(string username, int userId)
{
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.NameIdentifier, userId.ToString())
    };

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddHours(1),
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Register
app.MapPost("/register", async (ToDoDbContext db, User user) =>
{
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
    if (existingUser != null)
        return Results.BadRequest(new { message = "שם המשתמש כבר קיים במערכת" });

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var token = GenerateJwtToken(user.Username, user.Id);
    return Results.Ok(new { token });
});

// Login
app.MapPost("/login", async (ToDoDbContext db, User loginUser) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u =>
        u.Username == loginUser.Username && u.Password == loginUser.Password);

    if (user == null) return Results.Unauthorized();

    var token = GenerateJwtToken(user.Username, user.Id);
    return Results.Ok(new { token });
});

// Get all items
app.MapGet("/items", async (ToDoDbContext db) =>
{
    return await db.Items.ToListAsync();
}).RequireAuthorization();

// Add new item
app.MapPost("/items", async (ToDoDbContext db, Item newItem) =>
{
    db.Items.Add(newItem);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{newItem.Id}", newItem);
}).RequireAuthorization();

// Update item
app.MapPut("/items/{id}", async (int id, ToDoDbContext db, Item updatedItem) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.IsComplete = updatedItem.IsComplete;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// Delete item
app.MapDelete("/items/{id}", async (int id, ToDoDbContext db) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/", () => "🎉 TodoList Server is running!");
app.Run();
