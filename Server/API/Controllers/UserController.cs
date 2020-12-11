using API.DTO;
using AutoMapper;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly MediaContext _context;
        private readonly IMapper _mapper;
        public UserController(MediaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Route("settings")]
        [HttpPost]
        public async Task<ActionResult> UpdateUserSettings([FromBody] UpdateUserSettings updateUserSettings)
        {
            foreach (var library in updateUserSettings.ExistingLibraries.Concat(updateUserSettings.NewLibraries))
            {
                if (!Directory.Exists(library.FolderPath))
                {
                    return BadRequest("The specified folder path is invalid");
                }
            }
            foreach (var library in updateUserSettings.ExistingLibraries.Concat(updateUserSettings.NewLibraries))
            {
                var existing = _context.Libraries.FirstOrDefault(x => x.Name.ToUpper() == library.Name.ToUpper());
                if (existing?.Id != library.Id)
                {
                    return BadRequest($"A library called {library.Name} already exists");
                }
            }
            foreach (var library in updateUserSettings.ExistingLibraries)
            {
                var updateLibrary = _context.Libraries.FirstOrDefault(x => x.Id == library.Id);
                if (updateLibrary != null)
                {
                    updateLibrary.FolderPath = library.FolderPath;
                    updateLibrary.Name = library.Name;
                }
            }
            foreach (var library in updateUserSettings.NewLibraries)
            {
                var newLibrary = new Library()
                {
                    Name = library.Name,
                    CanRemove = true,
                    FolderPath = library.FolderPath
                };
                _context.Libraries.Add(newLibrary);
            }
            foreach (var library in updateUserSettings.RemovedLibraries)
            {
                var removeLibrary = _context.Libraries.FirstOrDefault(x => x.Id == library.Id);
                var mediaItems = _context.MediaItems.Where(x => x.LibraryId == library.Id);
                _context.MediaItems.RemoveRange(mediaItems);
                _context.Libraries.Remove(removeLibrary);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Route("settings")]
        [HttpGet]
        public UserSettingsDTO GetUserSettings()
        {
            var userSettings = _context.UserSettings.FirstOrDefault();
            var userSettingsDTO = new UserSettingsDTO(
                userSettings.Id,
                _mapper.Map<List<LibraryDTO>>(_context.Libraries));
            return userSettingsDTO;
        }
    }
}
