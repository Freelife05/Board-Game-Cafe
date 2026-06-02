using BoardGameCafe.API.DTOs.Reservation;
using BoardGameCafe.API.Helpers;

namespace BoardGameCafe.API.Services;

public interface IReservationService
{
    Task<PagedResult<ReservationDto>> GetAllAsync(string? status, DateTime? date, PaginationParams pagination);
    Task<PagedResult<ReservationDto>> GetByUserAsync(int userId, PaginationParams pagination);
    Task<ReservationDto> GetByIdAsync(int id, int userId, string userRole);
    Task<ReservationDto> CreateAsync(int userId, CreateReservationDto dto);
    Task<ReservationDto> UpdateAsync(int id, int userId, string userRole, UpdateReservationDto dto);
    Task DeleteAsync(int id, int userId, string userRole);
}
