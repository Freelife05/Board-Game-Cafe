namespace BoardGameCafe.API.DTOs.Reservation;

public class ReservationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int TableId { get; set; }
    public int TableNumber { get; set; }
    public int? BoardGameId { get; set; }
    public string? BoardGameTitle { get; set; }
    public DateTime ReservationDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int PartySize { get; set; }
    public double TotalCost { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
