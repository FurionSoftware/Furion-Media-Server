using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public record UpdateUserSettings(List<UpdateLibraryDTO> NewLibraries, List<UpdateLibraryDTO> ExistingLibraries, List<UpdateLibraryDTO> RemovedLibraries);

}
