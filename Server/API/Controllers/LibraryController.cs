using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using FileIO = System.IO.File;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/libraries")]
    public class LibraryController : ControllerBase
    {
        private readonly MediaContext _context;
        public LibraryController(MediaContext context)
        {
            _context = context;
        }
        [Route("reload")]
        [HttpPost]
        public ActionResult ReloadLibraries()
        {
            var libraries = _context.Libraries;
            foreach (var library in libraries)
            {
                if (!Directory.Exists(library.FolderPath))
                {
                    return BadRequest($"Cannot refresh library {library.FolderPath}, path not found");
                }
                var files = Directory.EnumerateFiles(library.FolderPath, "*.*", SearchOption.AllDirectories)
                    .Where(x => 
                    x.EndsWith(".mp4") || 
                    x.EndsWith(".ogg") || 
                    x.EndsWith(".wav") ||
                    x.EndsWith(".webm"));
                var mediaItems = _context.MediaItems;
                foreach (var file in files)
                {
                    var matchingMedia = mediaItems.FirstOrDefault(x => x.FilePath == file);
                    if (matchingMedia == null)
                    {
                        _context.MediaItems.Add(new MediaItem()
                        {
                            LibraryId = library.Id,
                            Title = Path.GetFileNameWithoutExtension(file),
                            FilePath = file
                        });
                    }
                }
                foreach (var mediaItem in mediaItems)
                {
                    if (!FileIO.Exists(mediaItem.FilePath))
                    {
                        _context.MediaItems.Remove(mediaItem);
                    }
                }
            }
            _context.SaveChanges();
            return Ok();
        }
    }
}
