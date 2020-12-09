using API.DTO;
using AutoMapper;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/media")]
    public class MediaController : ControllerBase
    {
        private readonly MediaContext _context;
        private readonly IMapper _mapper;
        public MediaController(MediaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [Route("allmedia/{libraryId}")]
        [HttpGet]
        public ActionResult<List<MediaListItemDTO>> GetAllLibraryMedia(int libraryId)
        {
            var mediaItems = _context.MediaItems.Where(x => x.LibraryId == libraryId);
            var mediaListItems = _mapper.Map<List<MediaListItemDTO>>(mediaItems);
            return Ok(mediaListItems);
        }

        [Route("filedata")]
        [HttpGet]
        public FileContentResult GetFileFromPath(string filePath)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string mimeType);
            return File(System.IO.File.ReadAllBytes(filePath), mimeType);
        }

        [Route("initialduration/{mediaId}")]
        [HttpPost]
        public ActionResult SetInitialMediaDuration(int mediaId, double duration)
        {
            var media = _context.MediaItems.First(x => x.Id == mediaId);
            media.Duration = (int) duration;
            _context.SaveChanges();
            return Ok();
        }

        [Route("updateplayedseconds/{mediaId}")]
        [HttpPost]
        public ActionResult UpdatedPlayedSeconds(int mediaId, double playedSeconds)
        {
            var media = _context.MediaItems.First(x => x.Id == mediaId);
            media.DurationPlayed = (int) playedSeconds;
            _context.SaveChanges();
            return Ok();
        }
    }
}
