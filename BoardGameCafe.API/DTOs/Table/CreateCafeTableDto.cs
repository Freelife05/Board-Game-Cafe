using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.DTOs.Table;

public class CreateCafeTableDto
{
    [Required, Range(1, 999)]
    public int TableNumber { get; set; }

    [Required, Range(1, 20)]
    public int Capacity { get; set; }

    public bool IsVIP { get; set; } = false;

    [Range(0, 500)]
    public double HourlyRate { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Available";

    [Required, MaxLength(50)]
    public string LocationZone { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }
}
