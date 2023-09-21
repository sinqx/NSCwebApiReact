using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApiReact.Models;

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
        public async Task<ActionResult<IEnumerable<UserReport>>> GetUsersReports()
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            return await _context.UsersReports.ToListAsync();
        }



        // GET all user's reports: api/UserReport/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetAllUserReports()
        {

            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            User user = await _userManager.GetUserAsync(User)
              ?? throw new Exception("Пользователь не найден.");

            var userReports = user.UserReports;

            if (userReports == null)
            {
                return NotFound();
            }

            return userReports.ToList();
        }


        // GET by god, kpred and month: api/UserReport/{god}/{kpred}/{month}
        [HttpGet("{god}/{kpred}/{month}")]
        public async Task<ActionResult<UserReport>> GetUserReportByGodYearMonth(string god, string kpred, string month)
        {

            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            User user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            var userReport = await _context.UsersReports.FirstOrDefaultAsync(
                report => report.GOD == god && report.K_PRED == kpred
                && report.Month == month && report.User.Id == user.Id);

            if (userReport is null)
            {
                return NotFound();
            }

            return userReport;
        }

        // POST: api/UserReport/create
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("create")]
        public async Task<ActionResult<UserReport>> PostUserReport(string k_pred)
        {

            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            string god = DateTime.Now.ToString("yyyy");

            string month = DateTime.Now.Month.ToString();

            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = k_pred,
                Month = month,
                User = user,
            };

            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            return userReport;
        }


        // POST: api/UserReport/createBy/{god}/{kpred}/{month}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("createBy/{god}/{kpred}/{month}")]
        public async Task<ActionResult<UserReport>> StartPostUserReport(string god, string kpred, string month)
        {
            if (!await _context.UsersReports.AnyAsync())
            {
                return Problem("Entity set 'APIDbContext.UsersReports' is empty.");
            }

            var checkUserReport = await _context.UsersReports.SingleOrDefaultAsync
                (report => report.GOD == god && report.K_PRED == kpred && report.Month == month);

            if (checkUserReport != null)
            {
                return await GetUserReportByGodYearMonth(god, kpred, month); // переотправка на страницу существующего отчёта
            }

            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

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


        // PUT: api/UserReport/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{userId}")]
        public async Task<IActionResult> PutUserReport(UserReport userReport)
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
                if (!UserReportExists(user.Id))
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

        private bool UserReportExists(string userId)
        {
            return (_context.UsersReports?.Any(e => e.User.Id == userId)).GetValueOrDefault();
        }
    }
}
