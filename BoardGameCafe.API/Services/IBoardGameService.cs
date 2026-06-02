using BoardGameCafe.API.DTOs.BoardGame;
using BoardGameCafe.API.Helpers;

namespace BoardGameCafe.API.Services;

public interface IBoardGameService
{
    Task<PagedResult<BoardGameDto>> GetAllAsync(string? title, string? genre, PaginationParams pagination);
    Task<BoardGameDto> GetByIdAsync(int id);
    Task<BoardGameDto> CreateAsync(CreateBoardGameDto dto);
    Task<BoardGameDto> UpdateAsync(int id, UpdateBoardGameDto dto);
    Task DeleteAsync(int id);
}
