using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class LibraryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool CanRemove { get; set; }
        public string FolderPath { get; set; }
    }
}
