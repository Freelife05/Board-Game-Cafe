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
            new() { Title = "Catan", Genre = "Strategy", MinPlayers = 3, MaxPlayers = 4, DifficultyLevel = "Medium", PlayTimeMinutes = 90, Condition = "Excellent", PricePerHour = 3.50, IsAvailable = true, Description = "Trade, build and settle.", FullDescription = "Catan is a classic resource management and trading game set on a modular hex-tile island. Players collect wood, brick, wheat, sheep, and ore to build roads, settlements, and cities. Trading with other players is key — diplomacy and negotiation are just as important as strategy. No two games are ever the same thanks to the randomised board setup. A must-play for anyone new to modern board gaming." },
            new() { Title = "Ticket to Ride", Genre = "Family", MinPlayers = 2, MaxPlayers = 5, DifficultyLevel = "Easy", PlayTimeMinutes = 60, Condition = "Good", PricePerHour = 2.50, IsAvailable = true, Description = "Build railway routes across the map.", FullDescription = "Ticket to Ride is a cross-country train adventure where players collect sets of coloured train cards and use them to claim railway routes across a sprawling map. Secret destination tickets give each player hidden goals, and completing long routes scores big bonus points. Easy to learn in minutes but with surprising strategic depth, it is one of the best gateways into the hobby for families and new players." },
            new() { Title = "Pandemic", Genre = "Cooperative", MinPlayers = 2, MaxPlayers = 4, DifficultyLevel = "Hard", PlayTimeMinutes = 60, Condition = "Good", PricePerHour = 3.00, IsAvailable = true, Description = "Save the world from disease outbreaks.", FullDescription = "Pandemic is a fully cooperative game where players take on specialist roles — Medic, Scientist, Dispatcher, and more — and work together to contain four deadly diseases spreading across the globe. Every turn the infection intensifies, and outbreaks can cascade out of control if the team does not plan carefully. Communication and coordination are essential. Win or lose together, every game tells a tense story of humanity fighting back." },
            new() { Title = "Codenames", Genre = "Party", MinPlayers = 2, MaxPlayers = 8, DifficultyLevel = "Easy", PlayTimeMinutes = 30, Condition = "Excellent", PricePerHour = 2.00, IsAvailable = true, Description = "Word association spy game.", FullDescription = "Codenames is a clever word-association party game for two rival teams. A grid of 25 codename cards lies on the table, and each team's spymaster knows which words belong to their agents. Spymasters give one-word clues to lead their teammates to the right cards — but one wrong guess and you might hand victory to the other side, or worse, uncover the assassin. Fast, funny, and perfect for large groups of any experience level." },
            new() { Title = "Azul", Genre = "Abstract", MinPlayers = 2, MaxPlayers = 4, DifficultyLevel = "Medium", PlayTimeMinutes = 45, Condition = "Excellent", PricePerHour = 3.00, IsAvailable = true, Description = "Beautiful tile-drafting game.", FullDescription = "Azul is an elegant tile-drafting game inspired by the decorative azulejo tiles of Portuguese palaces. Players take turns selecting colourful tiles from shared factory displays and placing them on their personal player boards to complete rows and patterns. Points are scored for completed lines and bonus patterns, but unplaced tiles incur penalties. With gorgeous components and satisfying tactical choices, Azul appeals equally to casual players and strategic thinkers." }
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
