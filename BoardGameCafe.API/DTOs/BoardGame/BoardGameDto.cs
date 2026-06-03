namespace BoardGameCafe.API.DTOs.BoardGame;

public class BoardGameDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public int MinPlayers { get; set; }
    public int MaxPlayers { get; set; }
    public string DifficultyLevel { get; set; } = string.Empty;
    public int PlayTimeMinutes { get; set; }
    public string Condition { get; set; } = string.Empty;
    public double PricePerHour { get; set; }
    public bool IsAvailable { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public string? FullDescription { get; set; }
    public DateTime AddedAt { get; set; }
}
