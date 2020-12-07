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
        public DbSet<Movie> Movies { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }
        public MediaContext()
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string codeBase = Assembly.GetExecutingAssembly().CodeBase;
            UriBuilder uri = new UriBuilder(codeBase);
            string path = Uri.UnescapeDataString(uri.Path);
            var dir = Path.GetDirectoryName(path);
            optionsBuilder.UseSqlite($"Data Source={Path.Combine(dir)}/FurionMediaServer.db");
        }
    }
}
