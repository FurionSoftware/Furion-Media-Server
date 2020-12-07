using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public record UpdateUserSettings(string MoviePath);
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
            var moviePath = updateUserSettings.MoviePath;
            if (!Directory.Exists(moviePath))
            {
                return BadRequest("The specified movie path is invalid");
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
            if (userSettings == null)
            {
                userSettings = new UserSettings()
                {
                    MoviePath = ""
                };
                _context.UserSettings.Add(userSettings);
                _context.SaveChanges();
                return userSettings;
            }
            return userSettings;
        }
    }
}
