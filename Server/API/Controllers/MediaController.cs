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

        [Route("item/{mediaId}")]
        [HttpGet]
        public ActionResult<MediaListItemDTO> GetMediaItem(int mediaId)
        {
            var mediaItem = _context.MediaItems.First(x => x.Id == mediaId);
            var mediaItemDto = _mapper.Map<MediaListItemDTO>(mediaItem);
            return Ok(mediaItemDto);
        }

        [Route("mediadata/{mediaId}")]
        [HttpGet]
        public FileResult GetFileData(int mediaId)
        {
            var media = _context.MediaItems.First(x => x.Id == mediaId);
            new FileExtensionContentTypeProvider().TryGetContentType(media.FilePath, out string mimeType);
            return PhysicalFile(media.FilePath, "application/octet-stream", enableRangeProcessing: true);
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
