namespace BoardGameCafe.API.DTOs.Table;

public class CafeTableDto
{
    public int Id { get; set; }
    public int TableNumber { get; set; }
    public int Capacity { get; set; }
    public bool IsVIP { get; set; }
    public double HourlyRate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string LocationZone { get; set; } = string.Empty;
    public string? Description { get; set; }
}
