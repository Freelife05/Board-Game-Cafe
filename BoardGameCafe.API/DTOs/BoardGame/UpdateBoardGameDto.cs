using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.DTOs.BoardGame;

public class UpdateBoardGameDto
{
    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Genre { get; set; } = string.Empty;

    [Required, Range(1, 20)]
    public int MinPlayers { get; set; }

    [Required, Range(1, 20)]
    public int MaxPlayers { get; set; }

    [Required, MaxLength(20)]
    public string DifficultyLevel { get; set; } = string.Empty;

    [Range(1, 600)]
    public int PlayTimeMinutes { get; set; }

    [Required, MaxLength(20)]
    public string Condition { get; set; } = string.Empty;

    [Range(0, 100)]
    public double PricePerHour { get; set; }

    public bool IsAvailable { get; set; }

    [MaxLength(255)]
    public string? ImageUrl { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
