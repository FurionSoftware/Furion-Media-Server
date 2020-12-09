using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class MediaContext : DbContext
    {
        public DbSet<MediaItem> MediaItems { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }
        public DbSet<Library> Libraries { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var directory = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var newDir = Directory.CreateDirectory(Path.Combine(directory, "Furion Media Server"));
            var dbPath = Path.Combine(newDir.FullName, "FurionMediaServer.db");
            optionsBuilder.UseSqlite($"Data Source={dbPath}");
        }
    }
}
