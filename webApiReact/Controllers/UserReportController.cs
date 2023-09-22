using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using webApiReact.Models;
using webApiReact.ViewModels;

namespace webApiReact.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserReportController : ControllerBase
    {
        private readonly APIDbContext _context;
        private readonly UserManager<User> _userManager;

        public UserReportController(APIDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        // GET: api/UserReport
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetAllUserReports()
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            return await _context.UsersReports.ToListAsync();
        }



        // GET all user's reports: api/UserReport/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetUsersReports()
        {

            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            User user = await _userManager.GetUserAsync(User)
              ?? throw new Exception("Пользователь не найден.");

            return user.UserReports is null ? NotFound() : user.UserReports.ToList();
        }


        // GET by god, kpred and month: api/UserReport/get
        [HttpGet("get")]
        public async Task<ActionResult<UserReport>> GetUserReportByYearMonthKpred(string god, string kpred, string month)
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесенны параметры");
            }

            var userReport = await _context.UsersReports
                .FirstOrDefaultAsync(ur => ur.GOD == god
                && ur.K_PRED == kpred && ur.Month == month);



            return userReport is null ? NotFound() : userReport;
        }

        // POST: api/UserReport/create
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("create")]
        public async Task<ActionResult<UserReport>> SaveUserReport(string kpred)
        {

            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            string god = DateTime.Now.ToString("yyyy");

            string month = DateTime.Now.Month.ToString();

            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            if (UserReportExists(user.Id, god, kpred, month))
            {
                return await GetUserReportByYearMonthKpred(god, kpred, month); // переотправка на страницу существующего отчёта
            }

            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Month = month,
                User = user,
            };

            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            return userReport;
        }


        // POST: api/UserReport/createBy/
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("createBy")]
        public async Task<ActionResult<UserReport>> CreateByYearMonthKpredUserReport(string god, string kpred, string month)
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесены параметры");
            }

            var user = await _userManager.GetUserAsync(User)
               ?? throw new Exception("Пользователь не найден.");

            if (UserReportExists(user.Id, god, kpred, month))
            {
                return await GetUserReportByYearMonthKpred(god, kpred, month); // переотправка на страницу существующего отчёта
            }

            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Month = month,
                User = user,
            };

            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserReport", new { userId = userReport.User }, userReport);
        }


        // PUT: api/UserReport/save
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("save")]
        public async Task<IActionResult> SaveUserReport(UserReport userReport)
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            var user = await _userManager.GetUserAsync(User)
                 ?? throw new Exception("Пользователь не найден.");

            if (userReport.User.Id != user.Id)
            {
                return BadRequest("Ошибка. Вызов неверного отчёта");
            }

            _context.Entry(userReport).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserReportExists(user.Id, userReport.GOD, userReport.K_PRED, userReport.Month))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // DELETE: api/UserReport/delete/{god}/{kpred}/{month}
        [HttpDelete("delete/{god}/{kpred}/{month}")]
        public async Task<IActionResult> DeleteUserReport(string god, string kpred, string month)
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесены параметры");
            }

            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            var userReport = await _context.UsersReports.SingleOrDefaultAsync(
                report => report.GOD == god && report.K_PRED == kpred
                && report.Month == month && report.User.Id == user.Id);

            if (userReport == null)
            {
                return NotFound();
            }

            _context.UsersReports.Remove(userReport);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserReportExists(string userId, string god, string kpred, string month)
        {
            return _context.UsersReports?.Any(e => e.User.Id == userId
            && e.GOD == god && e.K_PRED == kpred && e.Month == month) ?? false;
        }

        private static bool ValidateParameters(string god, string kpred, string month)
        {
            bool isGodValid = Regex.IsMatch(god, @"^\d{4}$");
            bool isKpredValid = Regex.IsMatch(kpred, @"^\d{8}$");
            bool isMonthValid = Regex.IsMatch(month, @"^\d{1,2}$");

            return isGodValid && isKpredValid && isMonthValid;
        }
    }

}
