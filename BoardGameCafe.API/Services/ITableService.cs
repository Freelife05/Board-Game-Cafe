using BoardGameCafe.API.DTOs.Table;
using BoardGameCafe.API.Helpers;

namespace BoardGameCafe.API.Services;

public interface ITableService
{
    Task<PagedResult<CafeTableDto>> GetAllAsync(string? status, string? locationZone, PaginationParams pagination);
    Task<CafeTableDto> GetByIdAsync(int id);
    Task<CafeTableDto> CreateAsync(CreateCafeTableDto dto);
    Task<CafeTableDto> UpdateAsync(int id, UpdateCafeTableDto dto);
    Task DeleteAsync(int id);
}
