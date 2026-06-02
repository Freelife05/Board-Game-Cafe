using BoardGameCafe.API.Models;

namespace BoardGameCafe.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var admin = new User
        {
            Username = "admin",
            Email = "admin@boardgamecafe.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        context.Users.Add(admin);

        var games = new List<BoardGame>
        {
            new() { Title = "Catan", Genre = "Strategy", MinPlayers = 3, MaxPlayers = 4, DifficultyLevel = "Medium", PlayTimeMinutes = 90, Condition = "Excellent", PricePerHour = 3.50, IsAvailable = true, Description = "Trade, build and settle." },
            new() { Title = "Ticket to Ride", Genre = "Family", MinPlayers = 2, MaxPlayers = 5, DifficultyLevel = "Easy", PlayTimeMinutes = 60, Condition = "Good", PricePerHour = 2.50, IsAvailable = true, Description = "Build railway routes across the map." },
            new() { Title = "Pandemic", Genre = "Cooperative", MinPlayers = 2, MaxPlayers = 4, DifficultyLevel = "Hard", PlayTimeMinutes = 60, Condition = "Good", PricePerHour = 3.00, IsAvailable = true, Description = "Save the world from disease outbreaks." },
            new() { Title = "Codenames", Genre = "Party", MinPlayers = 2, MaxPlayers = 8, DifficultyLevel = "Easy", PlayTimeMinutes = 30, Condition = "Excellent", PricePerHour = 2.00, IsAvailable = true, Description = "Word association spy game." },
            new() { Title = "Azul", Genre = "Abstract", MinPlayers = 2, MaxPlayers = 4, DifficultyLevel = "Medium", PlayTimeMinutes = 45, Condition = "Excellent", PricePerHour = 3.00, IsAvailable = true, Description = "Beautiful tile-drafting game." }
        };
        context.BoardGames.AddRange(games);

        var tables = new List<CafeTable>
        {
            new() { TableNumber = 1, Capacity = 4, IsVIP = false, HourlyRate = 5.00, Status = "Available", LocationZone = "Main Hall", Description = "Standard table near the window." },
            new() { TableNumber = 2, Capacity = 6, IsVIP = false, HourlyRate = 6.00, Status = "Available", LocationZone = "Main Hall", Description = "Large table for bigger groups." },
            new() { TableNumber = 3, Capacity = 2, IsVIP = true, HourlyRate = 10.00, Status = "Available", LocationZone = "VIP Lounge", Description = "Intimate VIP table with premium service." },
            new() { TableNumber = 4, Capacity = 8, IsVIP = false, HourlyRate = 8.00, Status = "Available", LocationZone = "Back Room", Description = "Private back room table." },
            new() { TableNumber = 5, Capacity = 4, IsVIP = true, HourlyRate = 12.00, Status = "Available", LocationZone = "VIP Lounge", Description = "VIP lounge table with complimentary snacks." }
        };
        context.CafeTables.AddRange(tables);

        await context.SaveChangesAsync();
    }
}
