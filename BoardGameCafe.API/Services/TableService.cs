using AutoMapper;
using BoardGameCafe.API.Data;
using BoardGameCafe.API.DTOs.Table;
using BoardGameCafe.API.Helpers;
using BoardGameCafe.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardGameCafe.API.Services;

public class TableService : ITableService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public TableService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<CafeTableDto>> GetAllAsync(string? status, string? locationZone, PaginationParams pagination)
    {
        var query = _context.CafeTables.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(t => t.Status.ToLower() == status.ToLower());

        if (!string.IsNullOrWhiteSpace(locationZone))
            query = query.Where(t => t.LocationZone.ToLower().Contains(locationZone.ToLower()));

        query = pagination.SortBy?.ToLower() switch
        {
            "tablenumber" => pagination.Descending ? query.OrderByDescending(t => t.TableNumber) : query.OrderBy(t => t.TableNumber),
            "capacity" => pagination.Descending ? query.OrderByDescending(t => t.Capacity) : query.OrderBy(t => t.Capacity),
            "hourlyrate" => pagination.Descending ? query.OrderByDescending(t => t.HourlyRate) : query.OrderBy(t => t.HourlyRate),
            _ => query.OrderBy(t => t.TableNumber)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        return new PagedResult<CafeTableDto>
        {
            Items = _mapper.Map<IEnumerable<CafeTableDto>>(items),
            TotalCount = total,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<CafeTableDto> GetByIdAsync(int id)
    {
        var table = await _context.CafeTables.FindAsync(id)
            ?? throw new KeyNotFoundException($"Table with id {id} not found.");
        return _mapper.Map<CafeTableDto>(table);
    }

    public async Task<CafeTableDto> CreateAsync(CreateCafeTableDto dto)
    {
        if (await _context.CafeTables.AnyAsync(t => t.TableNumber == dto.TableNumber))
            throw new InvalidOperationException($"Table number {dto.TableNumber} already exists.");

        var table = _mapper.Map<CafeTable>(dto);
        _context.CafeTables.Add(table);
        await _context.SaveChangesAsync();
        return _mapper.Map<CafeTableDto>(table);
    }

    public async Task<CafeTableDto> UpdateAsync(int id, UpdateCafeTableDto dto)
    {
        var table = await _context.CafeTables.FindAsync(id)
            ?? throw new KeyNotFoundException($"Table with id {id} not found.");

        if (await _context.CafeTables.AnyAsync(t => t.TableNumber == dto.TableNumber && t.Id != id))
            throw new InvalidOperationException($"Table number {dto.TableNumber} already exists.");

        _mapper.Map(dto, table);
        await _context.SaveChangesAsync();
        return _mapper.Map<CafeTableDto>(table);
    }

    public async Task DeleteAsync(int id)
    {
        var table = await _context.CafeTables.FindAsync(id)
            ?? throw new KeyNotFoundException($"Table with id {id} not found.");
        _context.CafeTables.Remove(table);
        await _context.SaveChangesAsync();
    }
}
