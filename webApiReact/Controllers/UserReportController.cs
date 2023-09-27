using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using webApiReact.Models;

namespace webApiReact.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserReportController : ControllerBase
    {
        // Контекст базы данных для доступа к таблицам и сущностям базы данных
        private readonly APIDbContext _context;

        // Менеджер пользователей для управления пользователями, включая аутентификацию и авторизацию
        private readonly UserManager<User> _userManager;

        public UserReportController(APIDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        // GET: api/UserReport
        // Получение всех отчётов пользователей
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetAllUserReports()
        {
            // Получение всех отчётов пользователей из базы данных
            var userReports = await _context.UsersReports.ToListAsync();

            // Проверка наличия отчётов
            return userReports is null ? NotFound("Отчётов не найдено") : userReports;
        }



        // GET all user's reports: api/UserReport/user
        // Получение всех отчётов пользователя
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsersReports()
        {
            // Получение текущего пользователя
            User user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            // Получение всех отчётов пользователя из базы данных
            // В ответе ожидается JSON ответ с отчётами и определёнными данными пользователя:
            // ID, Email, Username
            var userReports = await _context.UsersReports
                .Where(ur => ur.K_PRED == user.K_PRED)
                .Include(ur => ur.User)
                .Select(ur => new
                {
                    UserId = ur.User.Id,
                    UserEmail = ur.User.Email,
                    ur.User.UserName
                })
                .ToListAsync();

            // Возвращение списка отчётов пользователя или сообщения о их отсутствии
            return userReports is null
                ? NotFound($"У пользователя {user.Id}: {user.UserName} отчётов не найдено")
                : userReports;
        }


        /// GET by god, kpred and month: api/UserReport/get
        // Получение отчёта по году, КПРЭД и месяцу
        [HttpGet("get")]
        public async Task<ActionResult<UserReport>> GetUserReportByYearMonthKpred(string god, string kpred, string month)
        {
            // Проверка валидности переданных параметров
            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесены параметры.");
            }

            // Поиск отчёта по году, КПРЭД и месяцу
            var userReport = await _context.UsersReports
                .FirstOrDefaultAsync(ur => ur.GOD == god && ur.K_PRED == kpred && ur.Month == month);

            // Если отчёт не найден, создание нового отчёта, иначе выдача нужного Отчёта
            return userReport is null
                ? await CreateByYearMonthKpredUserReport(god, kpred, month)
                : userReport;
        }

        /// POST by kpred : api/UserReport/create
        // Создание нового отчёта
        [HttpPost("create")]
        public async Task<ActionResult<UserReport>> SaveUserReport(string kpred)
        {
            // Получение текущего года и месяца
            string god = DateTime.Now.ToString("yyyy");
            string month = DateTime.Now.Month.ToString();

            // Проверка, существует ли уже UserReport с заданным годом, kpred и месяцем
            if (UserReportExists(god, kpred, month))
            {
                return await GetUserReportByYearMonthKpred(god, kpred, month);
                // Перенаправление на страницу существующего отчета
            }

            // Получение текущего пользователя
            var user = await _userManager.GetUserAsync(User)
              ?? throw new Exception("Пользователь не найден."); // Пользователь не найден

            // Создание нового объекта UserReport
            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Month = month,
                User = user,
            };

            // Добавление UserReport в контекст и сохранение в базу данных
            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            // Возврат сохраненного UserReport
            return userReport;
        }


        /// POST: api/UserReport/createBy
        // Создание отчёта по году, КПРЭД и месяцу
        [HttpPost("createBy")]
        public async Task<ActionResult<UserReport>> CreateByYearMonthKpredUserReport(string god, string kpred, string month)
        {
            // Проверка параметров
            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесены параметры");
            }

            // Получение текущего пользователя
            var user = await _userManager.GetUserAsync(User)
               ?? throw new Exception("Пользователь не найден.");

            // Проверка, существует ли уже отчет пользователя для указанных параметров
            if (UserReportExists(god, kpred, month))
            {
                return await GetUserReportByYearMonthKpred(god, kpred, month); // Перенаправление на страницу существующего отчета
            }

            // Создание нового отчета пользователя
            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Month = month,
                User = user,
            };

            // Сохранение отчета пользователя в базе данных
            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            return userReport;
        }


        // PUT: api/UserReport/save
        // Обновление отчёта пользователя
        [HttpPut("change")]
        public async Task<IActionResult> ChangeUserReport(UserReport userReport)
        {
            // Получаем текущего пользователя 
            var user = await _userManager.GetUserAsync(User)
            ?? throw new Exception("Пользователь не найден.");

            // Проверяем, что идентификатор пользователя в отчёте совпадает с идентификатором текущего пользователя
            if (userReport.User.Id != user.Id)
            {
                return BadRequest("Ошибка. Вызов неверного отчёта");
            }

            // Устанавливаем состояние сущности userReport в Modified, чтобы отметить её как изменённую.
            _context.Entry(userReport).State = EntityState.Modified;

            try
            {
                // Сохраняем изменения в базе данных.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Мы проверяем, существует ли отчёт с указанными значениями полей GOD, K_PRED и Month.
                // Если отчёт не существует, возвращаем ошибку NotFound с сообщением.
                // В противном случае, пробрасываем исключение дальше.
                if (!UserReportExists(userReport.GOD, userReport.K_PRED, userReport.Month))
                {
                    return NotFound("Такого отчёта не существует");
                }
                else
                {
                    throw;
                }
            }

            // Если сохранение прошло успешно, возвращаем ответ NoContent (код 204) без тела ответа.
            return NoContent();
        }


        // DELETE: api/UserReport/delete/{god}/{kpred}/{month}
        // Удаление отчёта пользователя по указанным значениям
        [HttpDelete("delete/{god}/{kpred}/{month}")]
        public async Task<IActionResult> DeleteUserReport(string god, string kpred, string month)
        {
            // Проверка валидности переданных параметров
            if (!ValidateParameters(god, kpred, month))
            {
                return Problem("Неверно внесены параметры");
            }

            // Получаем текущего пользователя 
            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            // Ищем отчёт пользователя по указанным значениям 
            var userReport = await _context.UsersReports.SingleOrDefaultAsync(
                report => report.GOD == god && report.K_PRED == kpred
                && report.Month == month && report.User.Id == user.Id);

            // Если отчёт не найден, возвращаем ошибку NotFound с сообщением.
            if (userReport == null)
            {
                return NotFound("Такого отчёта не существует");
            }

            // Удаляем отчёт из контекста базы данных.
            _context.UsersReports.Remove(userReport);
            await _context.SaveChangesAsync();

            // Возвращаем ответ NoContent (код 204) без тела ответа.
            return NoContent();
        }

        //Проверка, существует ли отчёт с такими параметрами
        private bool UserReportExists(string god, string kpred, string month)
        {
            return _context.UsersReports?.Any(e => e.GOD == god
            && e.K_PRED == kpred && e.Month == month) ?? false;
        }

        //Проверка на нужное количество цифр в параметрах
        private static bool ValidateParameters(string god, string kpred, string month)
        {
            bool isGodValid = Regex.IsMatch(god, @"^\d{4}$");
            bool isKpredValid = Regex.IsMatch(kpred, @"^\d{8}$");
            bool isMonthValid = Regex.IsMatch(month, @"^\d{1,2}$");

            return isGodValid && isKpredValid && isMonthValid;
        }
    }

}
