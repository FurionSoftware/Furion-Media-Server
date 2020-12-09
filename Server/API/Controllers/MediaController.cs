using API.DTO;
using AutoMapper;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
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
    }
}
