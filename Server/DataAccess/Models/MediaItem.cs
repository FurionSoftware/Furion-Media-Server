using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class MediaItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int LibraryId { get; set; }
        public string FilePath { get; set; }
        public virtual Library Library { get; set; }
    }
}
