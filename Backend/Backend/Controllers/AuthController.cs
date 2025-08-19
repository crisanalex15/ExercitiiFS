using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend.Areas.Identity.Data;
using Backend.Models;
using Backend.Services;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtService jwtService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Date de înregistrare invalide",
                    });
                }

                // Verifică dacă utilizatorul există deja
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Un utilizator cu acest email există deja"
                    });
                }

                // Creează utilizatorul nou
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    EmailConfirmed = true // Pentru simplitate, nu cerem confirmarea email-ului
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = $"Eroare la crearea utilizatorului: {errors}"
                    });
                }

                // Generează JWT token
                var token = await _jwtService.GenerateJwtTokenAsync(user);
                var roles = await _userManager.GetRolesAsync(user);

                _logger.LogInformation($"Utilizator nou înregistrat: {user.Email}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Înregistrare reușită",
                    Token = token,
                    TokenExpiration = DateTime.UtcNow.AddHours(24),
                    User = new UserInfoDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        EmailConfirmed = user.EmailConfirmed,
                        CreatedAt = DateTime.UtcNow,
                        Roles = roles.ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la înregistrarea utilizatorului");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă la înregistrare"
                });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Date de autentificare invalide"
                    });
                }

                // Găsește utilizatorul după email
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return Unauthorized(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Email sau parolă incorectă"
                    });
                }

                // Verifică parola
                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!result.Succeeded)
                {
                    _logger.LogWarning($"Încercare de autentificare eșuată pentru: {model.Email}");
                    return Unauthorized(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Email sau parolă incorectă"
                    });
                }

                // Generează JWT token
                var token = await _jwtService.GenerateJwtTokenAsync(user);
                var roles = await _userManager.GetRolesAsync(user);

                _logger.LogInformation($"Utilizator autentificat cu succes: {user.Email}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Autentificare reușită",
                    Token = token,
                    TokenExpiration = DateTime.UtcNow.AddHours(24),
                    User = new UserInfoDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? "",
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        EmailConfirmed = user.EmailConfirmed,
                        CreatedAt = DateTime.UtcNow,
                        Roles = roles.ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la autentificarea utilizatorului");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă la autentificare"
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                _logger.LogInformation($"Utilizator deconectat: {User.Identity?.Name}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Deconectare reușită"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la deconectarea utilizatorului");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare la deconectare"
                });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Token invalid"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Utilizatorul nu a fost găsit"
                    });
                }

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Informații utilizator",
                    User = new UserInfoDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? "",
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        EmailConfirmed = user.EmailConfirmed,
                        CreatedAt = DateTime.UtcNow,
                        Roles = roles.ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea informațiilor utilizatorului");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă"
                });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Date invalide pentru schimbarea parolei"
                    });
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Utilizatorul nu a fost găsit"
                    });
                }

                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = $"Eroare la schimbarea parolei: {errors}"
                    });
                }

                _logger.LogInformation($"Parolă schimbată pentru utilizatorul: {user.Email}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Parolă schimbată cu succes"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la schimbarea parolei");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă"
                });
            }
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Email invalid"
                    });
                }

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    // Nu dezvăluim că utilizatorul nu există din motive de securitate
                    return Ok(new AuthResponseDto
                    {
                        Success = true,
                        Message = "Dacă email-ul există în sistem, vei primi instrucțiuni pentru resetarea parolei"
                    });
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                // TODO: Trimite email cu token-ul de resetare
                _logger.LogInformation($"Token de resetare parolă generat pentru: {user.Email}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Dacă email-ul există în sistem, vei primi instrucțiuni pentru resetarea parolei",
                    Token = token // În producție, acest token ar trebui trimis prin email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la resetarea parolei");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă"
                });
            }
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Date invalide pentru resetarea parolei"
                    });
                }

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Token invalid sau expirat"
                    });
                }

                var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = $"Eroare la resetarea parolei: {errors}"
                    });
                }

                _logger.LogInformation($"Parolă resetată pentru utilizatorul: {user.Email}");

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Parolă resetată cu succes"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la resetarea parolei");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "A apărut o eroare internă"
                });
            }
        }
    }
}
