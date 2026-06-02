using AutoMapper;
using BoardGameCafe.API.DTOs.BoardGame;
using BoardGameCafe.API.DTOs.Reservation;
using BoardGameCafe.API.DTOs.Table;
using BoardGameCafe.API.Models;

namespace BoardGameCafe.API.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<BoardGame, BoardGameDto>();
        CreateMap<CreateBoardGameDto, BoardGame>();
        CreateMap<UpdateBoardGameDto, BoardGame>();

        CreateMap<CafeTable, CafeTableDto>();
        CreateMap<CreateCafeTableDto, CafeTable>();
        CreateMap<UpdateCafeTableDto, CafeTable>();

        CreateMap<Reservation, ReservationDto>()
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.Username))
            .ForMember(d => d.TableNumber, o => o.MapFrom(s => s.Table.TableNumber))
            .ForMember(d => d.BoardGameTitle, o => o.MapFrom(s => s.BoardGame != null ? s.BoardGame.Title : null));

        CreateMap<CreateReservationDto, Reservation>();
        CreateMap<UpdateReservationDto, Reservation>();
    }
}
