using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class Library
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool CanRemove { get; set; }
        public string FolderPath { get; set; }

        public virtual ICollection<MediaItem> MediaItems { get; set; }
    }
}
