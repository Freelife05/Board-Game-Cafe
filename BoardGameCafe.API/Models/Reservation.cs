using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.Models;

public class Reservation
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public int TableId { get; set; }
    public CafeTable Table { get; set; } = null!;

    public int? BoardGameId { get; set; }
    public BoardGame? BoardGame { get; set; }

    [Required]
    public DateTime ReservationDate { get; set; }

    [Required]
    public TimeSpan StartTime { get; set; }

    [Required]
    public TimeSpan EndTime { get; set; }

    [Required]
    public int PartySize { get; set; }

    public double TotalCost { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Pending";

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
