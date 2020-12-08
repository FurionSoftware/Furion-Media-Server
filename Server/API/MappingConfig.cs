using API.DTO;
using AutoMapper;
using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<UserSettings, UserSettingsDTO>();
            CreateMap<Library, LibraryDTO>();
        }

    }
}
