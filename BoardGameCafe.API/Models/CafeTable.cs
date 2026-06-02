using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.Models;

public class CafeTable
{
    public int Id { get; set; }

    [Required]
    public int TableNumber { get; set; }

    [Required]
    public int Capacity { get; set; }

    public bool IsVIP { get; set; } = false;

    public double HourlyRate { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Available";

    [MaxLength(50)]
    public string LocationZone { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
