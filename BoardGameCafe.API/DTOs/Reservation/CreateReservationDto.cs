using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.DTOs.Reservation;

public class CreateReservationDto
{
    [Required]
    public int TableId { get; set; }

    public int? BoardGameId { get; set; }

    [Required]
    public DateTime ReservationDate { get; set; }

    [Required]
    public TimeSpan StartTime { get; set; }

    [Required]
    public TimeSpan EndTime { get; set; }

    [Required, Range(1, 20)]
    public int PartySize { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}
