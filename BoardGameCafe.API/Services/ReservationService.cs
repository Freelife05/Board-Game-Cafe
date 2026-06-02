using AutoMapper;
using BoardGameCafe.API.Data;
using BoardGameCafe.API.DTOs.Reservation;
using BoardGameCafe.API.Helpers;
using BoardGameCafe.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardGameCafe.API.Services;

public class ReservationService : IReservationService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ReservationService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<ReservationDto>> GetAllAsync(string? status, DateTime? date, PaginationParams pagination)
    {
        var query = _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .Include(r => r.BoardGame)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status.ToLower() == status.ToLower());

        if (date.HasValue)
            query = query.Where(r => r.ReservationDate.Date == date.Value.Date);

        query = pagination.SortBy?.ToLower() switch
        {
            "date" => pagination.Descending ? query.OrderByDescending(r => r.ReservationDate) : query.OrderBy(r => r.ReservationDate),
            "status" => pagination.Descending ? query.OrderByDescending(r => r.Status) : query.OrderBy(r => r.Status),
            "totalcost" => pagination.Descending ? query.OrderByDescending(r => r.TotalCost) : query.OrderBy(r => r.TotalCost),
            _ => query.OrderByDescending(r => r.CreatedAt)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        return new PagedResult<ReservationDto>
        {
            Items = _mapper.Map<IEnumerable<ReservationDto>>(items),
            TotalCount = total,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<PagedResult<ReservationDto>> GetByUserAsync(int userId, PaginationParams pagination)
    {
        var query = _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .Include(r => r.BoardGame)
            .Where(r => r.UserId == userId)
            .AsQueryable();

        query = pagination.Descending
            ? query.OrderByDescending(r => r.ReservationDate)
            : query.OrderBy(r => r.ReservationDate);

        var total = await query.CountAsync();
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        return new PagedResult<ReservationDto>
        {
            Items = _mapper.Map<IEnumerable<ReservationDto>>(items),
            TotalCount = total,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<ReservationDto> GetByIdAsync(int id, int userId, string userRole)
    {
        var reservation = await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .Include(r => r.BoardGame)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException($"Reservation with id {id} not found.");

        if (userRole != "Admin" && reservation.UserId != userId)
            throw new UnauthorizedAccessException("You can only view your own reservations.");

        return _mapper.Map<ReservationDto>(reservation);
    }

    private async Task<ReservationDto> GetByIdInternalAsync(int id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .Include(r => r.BoardGame)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException($"Reservation with id {id} not found.");

        return _mapper.Map<ReservationDto>(reservation);
    }

    public async Task<ReservationDto> CreateAsync(int userId, CreateReservationDto dto)
    {
        if (dto.StartTime >= dto.EndTime)
            throw new ArgumentException("Start time must be before end time.");

        var table = await _context.CafeTables.FindAsync(dto.TableId)
            ?? throw new KeyNotFoundException($"Table with id {dto.TableId} not found.");

        if (table.Capacity < dto.PartySize)
            throw new InvalidOperationException($"Table capacity ({table.Capacity}) is less than party size ({dto.PartySize}).");

        var sameSlot = await _context.Reservations
            .Where(r => r.TableId == dto.TableId &&
                        r.ReservationDate.Date == dto.ReservationDate.Date &&
                        r.Status != "Cancelled")
            .ToListAsync();

        if (sameSlot.Any(r => r.StartTime < dto.EndTime && r.EndTime > dto.StartTime))
            throw new InvalidOperationException("Table is already reserved for the selected time slot.");

        if (dto.BoardGameId.HasValue)
        {
            var game = await _context.BoardGames.FindAsync(dto.BoardGameId.Value)
                ?? throw new KeyNotFoundException($"Board game with id {dto.BoardGameId} not found.");
            if (!game.IsAvailable)
                throw new InvalidOperationException("Selected board game is not available.");
        }

        var hours = (dto.EndTime - dto.StartTime).TotalHours;
        var totalCost = hours * table.HourlyRate;

        var reservation = _mapper.Map<Reservation>(dto);
        reservation.UserId = userId;
        reservation.TotalCost = totalCost;
        reservation.Status = "Confirmed";

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return await GetByIdInternalAsync(reservation.Id);
    }

    public async Task<ReservationDto> UpdateAsync(int id, int userId, string userRole, UpdateReservationDto dto)
    {
        var reservation = await _context.Reservations.FindAsync(id)
            ?? throw new KeyNotFoundException($"Reservation with id {id} not found.");

        if (userRole != "Admin" && reservation.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own reservations.");

        if (dto.StartTime >= dto.EndTime)
            throw new ArgumentException("Start time must be before end time.");

        var table = await _context.CafeTables.FindAsync(dto.TableId)
            ?? throw new KeyNotFoundException($"Table with id {dto.TableId} not found.");

        if (table.Capacity < dto.PartySize)
            throw new InvalidOperationException($"Table capacity ({table.Capacity}) is less than party size ({dto.PartySize}).");

        var sameSlotUpdate = await _context.Reservations
            .Where(r => r.Id != id &&
                        r.TableId == dto.TableId &&
                        r.ReservationDate.Date == dto.ReservationDate.Date &&
                        r.Status != "Cancelled")
            .ToListAsync();

        if (sameSlotUpdate.Any(r => r.StartTime < dto.EndTime && r.EndTime > dto.StartTime))
            throw new InvalidOperationException("Table is already reserved for the selected time slot.");

        var hours = (dto.EndTime - dto.StartTime).TotalHours;
        reservation.TotalCost = hours * table.HourlyRate;

        var originalStatus = reservation.Status;
        _mapper.Map(dto, reservation);
        if (userRole != "Admin")
            reservation.Status = originalStatus;

        await _context.SaveChangesAsync();

        return await GetByIdInternalAsync(reservation.Id);
    }

    public async Task DeleteAsync(int id, int userId, string userRole)
    {
        var reservation = await _context.Reservations.FindAsync(id)
            ?? throw new KeyNotFoundException($"Reservation with id {id} not found.");

        if (userRole != "Admin" && reservation.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own reservations.");

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();
    }
}
