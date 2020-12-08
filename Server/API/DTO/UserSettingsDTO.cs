using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public record UserSettingsDTO
    {
        public int Id { get; set; }
        public List<LibraryDTO> Libraries { get; set; }
    }
}
