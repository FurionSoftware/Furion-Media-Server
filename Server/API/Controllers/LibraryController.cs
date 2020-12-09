using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using FileIO = System.IO.File;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using AutoMapper;

namespace API.Controllers
{
    [Route("api/libraries")]
    public class LibraryController : ControllerBase
    {
        private readonly MediaContext _context;
        private readonly IMapper _mapper;
        public LibraryController(MediaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Route("")]
        [HttpGet]
        public ActionResult<List<LibraryDTO>> GetLibraries()
        {
            return _mapper.Map<List<LibraryDTO>>(_context.Libraries);
        }

        [Route("{libraryName}")]
        [HttpGet]
        public ActionResult<LibraryPageDetailDTO> GetLibraryPageDetail(string libraryName)
        {
            var library = _context.Libraries.FirstOrDefault(x => x.Name.ToUpper() == libraryName.ToUpper());
            if (library != null)
            {
                return Ok(_mapper.Map<LibraryPageDetailDTO>(library));
            }
            return NotFound();
        }

        [Route("reload")]
        [HttpPost]
        public ActionResult ReloadLibraries()
        {
            var libraries = _context.Libraries.Where(x => !String.IsNullOrEmpty(x.FolderPath));
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
                var mediaItems = _context.MediaItems.Where(x => x.LibraryId == library.Id).ToList();
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
                    if (!mediaItem.FilePath.StartsWith(library.FolderPath))
                    {
                        _context.MediaItems.Remove(mediaItem);
                    }
                    else if (!FileIO.Exists(mediaItem.FilePath))
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
