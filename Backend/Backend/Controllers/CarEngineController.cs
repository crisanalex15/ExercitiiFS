using System.Diagnostics;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.Areas.Identity.Data;

namespace Backend.Controllers
{
    public class CarEngineController : Controller
    {
        private readonly ILogger<CarEngineController> _logger;

        private readonly AuthDbContext _context;

        public CarEngineController(ILogger<CarEngineController> logger, AuthDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("api/car-engine/cars")]
        [AllowAnonymous]
        public IActionResult GetCars(int page = 1, int pageSize = 6)
        {
            try
            {
                // Validare parametri
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 6;

                var totalCount = _context.Cars.Count();
                var cars = _context.Cars
                    .Include(c => c.Engine)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                // Pentru debugging
                _logger.LogInformation($"Fetching page {page}, pageSize {pageSize}, found {cars.Count} cars, total: {totalCount}");

                return Ok(cars);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching cars");
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/car-engine/cars")]
        [AllowAnonymous]
        public IActionResult CreateCar([FromBody] CreateCarDto carDto)
        {
            // Verifică dacă engine-ul există
            var engineExists = _context.Engines.Any(e => e.Id == carDto.EngineId);
            if (!engineExists)
            {
                return BadRequest(new { message = "Engine-ul cu ID-ul specificat nu există" });
            }

            // Creează mașina doar cu EngineId
            var car = new Car
            {
                Model = carDto.Model,
                Brand = carDto.Brand,
                Year = carDto.Year,
                Color = carDto.Color,
                FuelType = carDto.FuelType,
                Transmission = carDto.Transmission,
                Mileage = carDto.Mileage,
                Price = carDto.Price,
                EngineId = carDto.EngineId
                // Nu setăm Engine - EF va face join-ul automat
            };

            _context.Cars.Add(car);
            _context.SaveChanges();

            // Returnează mașina cu engine-ul inclus
            var savedCar = _context.Cars.Include(c => c.Engine)
                                      .FirstOrDefault(c => c.Id == car.Id);

            return Ok(savedCar);
        }

        [HttpPut]
        [Route("api/car-engine/cars/{id}")]
        [AllowAnonymous]
        public IActionResult UpdateCar(int id, [FromBody] CreateCarDto carDto)
        {
            var existingCar = _context.Cars.Find(id);
            if (existingCar == null)
            {
                return NotFound(new { message = "Mașina nu a fost găsită" });
            }

            // Verifică dacă engine-ul există
            var engineExists = _context.Engines.Any(e => e.Id == carDto.EngineId);
            if (!engineExists)
            {
                return BadRequest(new { message = "Engine-ul cu ID-ul specificat nu există" });
            }

            existingCar.Model = carDto.Model;
            existingCar.Brand = carDto.Brand;
            existingCar.Year = carDto.Year;
            existingCar.Color = carDto.Color;
            existingCar.FuelType = carDto.FuelType;
            existingCar.Transmission = carDto.Transmission;
            existingCar.Mileage = carDto.Mileage;
            existingCar.Price = carDto.Price;
            existingCar.EngineId = carDto.EngineId;

            _context.SaveChanges();

            // Returnează mașina actualizată cu engine-ul inclus
            var updatedCar = _context.Cars.Include(c => c.Engine)
                                        .FirstOrDefault(c => c.Id == id);
            return Ok(updatedCar);
        }

        [HttpDelete]
        [Route("api/car-engine/cars/{id}")]
        [AllowAnonymous]
        public IActionResult DeleteCar(int id)
        {
            var car = _context.Cars.Find(id);
            if (car == null)
            {
                return NotFound();
            }
            _context.Cars.Remove(car);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet]
        [Route("api/car-engine/engines")]
        [AllowAnonymous]
        public IActionResult GetEngines()
        {
            var engines = _context.Engines.ToList();
            return Ok(engines);
        }

        [HttpPost]
        [Route("api/car-engine/engines")]
        [AllowAnonymous]
        public IActionResult CreateEngine([FromBody] Engine engine)
        {
            _context.Engines.Add(engine);
            _context.SaveChanges();
            return Ok(engine);
        }

        [HttpPut]
        [Route("api/car-engine/engines/{id}")]
        [AllowAnonymous]
        public IActionResult UpdateEngine(int id, [FromBody] Engine engine)
        {
            try
            {
                var existingEngine = _context.Engines.Find(id);
                if (existingEngine == null)
                {
                    return NotFound(new { message = "Engine not found" });
                }

                existingEngine.Brand = engine.Brand;
                existingEngine.FuelType = engine.FuelType;
                existingEngine.Power = engine.Power;
                existingEngine.Torque = engine.Torque;
                existingEngine.Displacement = engine.Displacement;

                _context.SaveChanges();

                return Ok(existingEngine);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Update failed", error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("api/car-engine/engines/{id}")]
        [AllowAnonymous]
        public IActionResult DeleteEngine(int id)
        {
            var engine = _context.Engines.Find(id);
            if (engine == null)
            {
                return NotFound();
            }
            _context.Engines.Remove(engine);
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
