using System.Diagnostics;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.Areas.Identity.Data;


namespace Backend.Controllers
{
    [Authorize]
    public class MotorcycleController : Controller
    {
        private readonly ILogger<MotorcycleController> _logger;

        private readonly AuthDbContext _context;

        public MotorcycleController(ILogger<MotorcycleController> logger, AuthDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("api/motorcycle/motociclete")]
        [AllowAnonymous]
        public IActionResult GetMotociclete()
        {
            var motociclete = _context.Motociclete.Include(m => m.Engine).ToList();
            return Ok(motociclete);
        }

        [HttpPost]
        [Route("api/motorcycle/motociclete")]
        [AllowAnonymous]
        public IActionResult CreateMotocicleta([FromBody] CreateMotocicletaDto motocicletaDto)
        {
            var engineExists = _context.Engines.Any(e => e.Id == motocicletaDto.EngineId);
            if (!engineExists)
            {
                return BadRequest(new { message = "Engine-ul cu ID-ul specificat nu există" });
            }
            var motocicleta = new Motociclete
            {
                Brand = motocicletaDto.Brand,
                Model = motocicletaDto.Model,
                Year = motocicletaDto.Year,
                Color = motocicletaDto.Color,
                FuelType = motocicletaDto.FuelType,
                Transmission = motocicletaDto.Transmission,
                Mileage = motocicletaDto.Mileage,
                Price = motocicletaDto.Price,
                EngineId = motocicletaDto.EngineId
            };
            _context.Motociclete.Add(motocicleta);
            _context.SaveChanges();

            // Returnează motocicleta cu engine-ul inclus
            var savedMotocicleta = _context.Motociclete.Include(m => m.Engine)
                                                      .FirstOrDefault(m => m.Id == motocicleta.Id);
            return Ok(savedMotocicleta);
        }

        [HttpPut]
        [Route("api/motorcycle/motociclete/{id}")]
        [AllowAnonymous]
        public IActionResult UpdateMotocicleta(int id, [FromBody] CreateMotocicletaDto motocicletaDto)
        {
            var motocicleta = _context.Motociclete.Find(id);
            if (motocicleta == null)
            {
                return NotFound(new { message = "Motocicleta nu a fost găsită" });
            }

            // Verifică dacă engine-ul există
            var engineExists = _context.Engines.Any(e => e.Id == motocicletaDto.EngineId);
            if (!engineExists)
            {
                return BadRequest(new { message = "Engine-ul cu ID-ul specificat nu există" });
            }

            motocicleta.Brand = motocicletaDto.Brand;
            motocicleta.Model = motocicletaDto.Model;
            motocicleta.Year = motocicletaDto.Year;
            motocicleta.Color = motocicletaDto.Color;
            motocicleta.FuelType = motocicletaDto.FuelType;
            motocicleta.Transmission = motocicletaDto.Transmission;
            motocicleta.Mileage = motocicletaDto.Mileage;
            motocicleta.Price = motocicletaDto.Price;
            motocicleta.EngineId = motocicletaDto.EngineId;

            _context.SaveChanges();

            // Returnează motocicleta actualizată cu engine-ul inclus
            var updatedMotocicleta = _context.Motociclete.Include(m => m.Engine)
                                                        .FirstOrDefault(m => m.Id == id);
            return Ok(updatedMotocicleta);
        }

        [HttpDelete]
        [Route("api/motorcycle/motociclete/{id}")]
        [AllowAnonymous]
        public IActionResult DeleteMotocicleta(int id)
        {
            var motocicleta = _context.Motociclete.Find(id);
            if (motocicleta == null)
            {
                return NotFound();
            }
            _context.Motociclete.Remove(motocicleta);
            _context.SaveChanges();
            return Ok();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
