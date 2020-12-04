using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/movies")]
    public class MovieController : ControllerBase
    {
        [Route("")]
        [HttpGet]
        public ActionResult<string> GetAllMovies()
        {
            return Ok("hello world");
        }
    }
}
