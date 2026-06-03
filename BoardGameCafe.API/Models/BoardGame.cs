using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.Models;

public class BoardGame
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Genre { get; set; } = string.Empty;

    [Required]
    public int MinPlayers { get; set; }

    [Required]
    public int MaxPlayers { get; set; }

    [Required, MaxLength(20)]
    public string DifficultyLevel { get; set; } = string.Empty;

    public int PlayTimeMinutes { get; set; }

    [Required, MaxLength(20)]
    public string Condition { get; set; } = "Good";

    public double PricePerHour { get; set; }

    public bool IsAvailable { get; set; } = true;

    [MaxLength(255)]
    public string? ImageUrl { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required, MinLength(10), MaxLength(1000)]
    public string FullDescription { get; set; } = string.Empty;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
