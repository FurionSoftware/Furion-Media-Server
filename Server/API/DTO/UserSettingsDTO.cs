using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public record UserSettingsDTO(int Id, List<LibraryDTO> Libraries);
}
