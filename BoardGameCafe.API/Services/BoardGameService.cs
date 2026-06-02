using AutoMapper;
using BoardGameCafe.API.Data;
using BoardGameCafe.API.DTOs.BoardGame;
using BoardGameCafe.API.Helpers;
using BoardGameCafe.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardGameCafe.API.Services;

public class BoardGameService : IBoardGameService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public BoardGameService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<BoardGameDto>> GetAllAsync(string? title, string? genre, PaginationParams pagination)
    {
        var query = _context.BoardGames.AsQueryable();

        if (!string.IsNullOrWhiteSpace(title))
            query = query.Where(g => g.Title.ToLower().Contains(title.ToLower()));

        if (!string.IsNullOrWhiteSpace(genre))
            query = query.Where(g => g.Genre.ToLower().Contains(genre.ToLower()));

        query = pagination.SortBy?.ToLower() switch
        {
            "title" => pagination.Descending ? query.OrderByDescending(g => g.Title) : query.OrderBy(g => g.Title),
            "genre" => pagination.Descending ? query.OrderByDescending(g => g.Genre) : query.OrderBy(g => g.Genre),
            "priceperhour" => pagination.Descending ? query.OrderByDescending(g => g.PricePerHour) : query.OrderBy(g => g.PricePerHour),
            "difficultylevel" => pagination.Descending ? query.OrderByDescending(g => g.DifficultyLevel) : query.OrderBy(g => g.DifficultyLevel),
            _ => query.OrderBy(g => g.Title)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        return new PagedResult<BoardGameDto>
        {
            Items = _mapper.Map<IEnumerable<BoardGameDto>>(items),
            TotalCount = total,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<BoardGameDto> GetByIdAsync(int id)
    {
        var game = await _context.BoardGames.FindAsync(id)
            ?? throw new KeyNotFoundException($"Board game with id {id} not found.");
        return _mapper.Map<BoardGameDto>(game);
    }

    public async Task<BoardGameDto> CreateAsync(CreateBoardGameDto dto)
    {
        if (dto.MinPlayers > dto.MaxPlayers)
            throw new ArgumentException("MinPlayers cannot be greater than MaxPlayers.");

        var game = _mapper.Map<BoardGame>(dto);
        _context.BoardGames.Add(game);
        await _context.SaveChangesAsync();
        return _mapper.Map<BoardGameDto>(game);
    }

    public async Task<BoardGameDto> UpdateAsync(int id, UpdateBoardGameDto dto)
    {
        var game = await _context.BoardGames.FindAsync(id)
            ?? throw new KeyNotFoundException($"Board game with id {id} not found.");

        if (dto.MinPlayers > dto.MaxPlayers)
            throw new ArgumentException("MinPlayers cannot be greater than MaxPlayers.");

        _mapper.Map(dto, game);
        await _context.SaveChangesAsync();
        return _mapper.Map<BoardGameDto>(game);
    }

    public async Task DeleteAsync(int id)
    {
        var game = await _context.BoardGames.FindAsync(id)
            ?? throw new KeyNotFoundException($"Board game with id {id} not found.");
        _context.BoardGames.Remove(game);
        await _context.SaveChangesAsync();
    }
}
