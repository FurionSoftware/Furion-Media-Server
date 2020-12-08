using API.DTO;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public record UpdateUserSettings(List<LibraryDTO> libraries);
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly MediaContext _context;
        public UserController(MediaContext context)
        {
            _context = context;
        }

        [Route("settings")]
        [HttpPost]
        public async Task<ActionResult> UpdateUserSettings([FromBody] UpdateUserSettings updateUserSettings)
        {
            foreach (var library in updateUserSettings.libraries)
            {
                if (!Directory.Exists(library.FolderPath))
                {
                    return BadRequest("The specified folder path is invalid");
                }
            }
            
            var userSettings = _context.UserSettings.First();
            userSettings.MoviePath = updateUserSettings.MoviePath;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Route("settings")]
        [HttpGet]
        public UserSettings GetUserSettings()
        {
            var userSettings = _context.UserSettings.FirstOrDefault();
            return userSettings;
        }
    }
}
