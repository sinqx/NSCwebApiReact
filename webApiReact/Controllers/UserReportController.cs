using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using webApiReact.Models;
using System.Text.Json;
using System;

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


        /// GET: api/UserReport
        // Получение всех отчётов пользователей
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetAllUserReports()
        {
            // Получение всех отчётов пользователей из базы данных
            var userReports = await _context.UsersReports.ToListAsync();
            // Проверка наличия отчётов
            return userReports is null ? NotFound("Отчётов не найдено") : userReports;
        }



        /// GET all user's reports: api/UserReport/user
        // Получение всех отчётов пользователя
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<UserReport>>> GetUsersReports()
        {
            // Получение текущего пользователя
            User user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            // Получение всех отчётов пользователя из базы данных
            var userReports = await _context.UsersReports
                .Where(ur => ur.K_PRED == user.K_PRED)
                .ToListAsync();

            // Возвращение списка отчётов пользователя или сообщения о их отсутствии
            return userReports is null
                ? NotFound($"У пользователя {user.Id}: {user.UserName} отчётов не найдено")
                : userReports;
        }


        /// GET by god and kvartal: api/UserReport/getInfo
        // Получение отчёта по году и кварталу
        [HttpGet("getInfo")]
        public async Task<ActionResult<UserReport>> GetUserReportByYearKvartal(int god, int kpred, char kvartal)
        {

            // Проверка валидности переданных параметров
            if (!ValidateParameters(god, kpred, kvartal))
            {
                return Problem("Неверно внесены параметры.");
            }

            //// Получение текущего пользователя
            //var user = await _userManager.GetUserAsync(User)
            //  ?? throw new Exception("Пользователь не найден.");

            //if (kpred != user.K_PRED)
            //{
            //    return Problem("Ошибка получения информации об отчёте.");
            //}

            // Поиск отчёта по году, КПРЭД и месяцу
            var userReport = await _context.UsersReports.SingleOrDefaultAsync(
               report => report.GOD == god && report.K_PRED == kpred
               && report.Kvartal == kvartal);

            // Если отчёт не найден, создание нового отчёта, иначе выдача нужного Отчёта
            return userReport is null
                ? await CreateByYearKvartalUserReport(god, kvartal)
                : userReport;
        }

        /// POST by kpred : api/UserReport/create
        // Создание нового отчёта
        [HttpPost("create")]
        public async Task<ActionResult<UserReport>> CreateUserReport()
        {
            // Получение текущего года и месяца
            int god = DateTime.Now.Year;
            int month = DateTime.Now.Month;
            char kvartal = (char)(((month + 2) / 3) + '0');
            // Получение текущего пользователя
            //var user = await _userManager.GetUserAsync(User)
            //  ?? throw new Exception("Пользователь не найден.");

            //Записывай Код предприятия пользователя
            // int kpred = user.K_PRED;
            int kpred = 22222222;

            // Проверка, существует ли уже UserReport с заданным годом, kpred и месяцем
            if (UserReportExists(god, kpred, kvartal))
            {
                return await GetUserReportByYearKvartal(god, kpred, kvartal);
                // Перенаправление на страницу существующего отчета
            }

            var user = await _userManager.FindByNameAsync("test1");
            // Создание нового объекта UserReport
            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Kvartal = kvartal,
                User = user,
            };

            // Добавление UserReport в контекст и сохранение в базу данных
            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            // Возврат сохраненного UserReport
            return userReport;
        }


        /// POST: api/UserReport/createBy
        // Создание отчёта по году, КПРЭД и кварталу
        [HttpPost("createBy")]
        public async Task<ActionResult<UserReport>> CreateByYearKvartalUserReport(int god, char kvartal)
        {
            // Получение текущего пользователя
            var user = await _userManager.GetUserAsync(User)
               ?? throw new Exception("Пользователь не найден.");

            int kpred = user.K_PRED;

            // Проверка параметров
            if (!ValidateParameters(god, kpred, kvartal))
            {
                return Problem("Неверно внесены параметры");
            }

            // Проверка, существует ли уже отчет пользователя для указанных параметров
            if (UserReportExists(god, kpred, kvartal))
            {
                return await GetUserReportByYearKvartal(god, kpred, kvartal); // Перенаправление на страницу существующего отчета
            }

            // Создание нового отчета пользователя
            var userReport = new UserReport
            {
                GOD = god,
                K_PRED = kpred,
                Kvartal = kvartal,
                User = user,
            };

            // Сохранение отчета пользователя в базе данных
            _context.UsersReports.Add(userReport);
            await _context.SaveChangesAsync();

            return userReport;
        }

        /// PUT: api/UserReport/replace
        // Полное обновление отчёта пользователя
        [HttpPut("replace")]
        public async Task<ActionResult<UserReport>> ReplaceUserReport(UserReport newReport)
        {
            //var user = await _userManager.GetUserAsync(User)
            //    ?? throw new Exception("Пользователь не найден.");

            var existingReport = await _context.UsersReports.SingleOrDefaultAsync(
                report => report.GOD == newReport.GOD && report.K_PRED == newReport.K_PRED
                && report.Kvartal == newReport.Kvartal);

            if (existingReport == null)
            {
                return NotFound("Такого отчета не существует");
            }
            newReport.User = existingReport.User;

            // Заменяем существующий отчёт новым отчётом
            _context.Entry(existingReport).CurrentValues.SetValues(newReport);
            await _context.SaveChangesAsync();

            return newReport;
        }

        // Функция Динамического обновления отчёта. Обновляет лишь один или несколько параметров.
        // Принимает в себя параметры для нахождения отчёта, и параметры вида - (Название элемента - значение элемента).
        // Отключенно из-за использование стандартной функции полного обновления отчёта.
        /// PATCH: api/UserReport/change
        //    [HttpPatch("change")]
        //    public async Task<ActionResult<UserReport>> UpdateUserReport(int god, int k_pred, char kvartal, IDictionary<string, object> parameters)
        //    {
        //   // var user = await _userManager.GetUserAsync(User) ?? throw new Exception("Пользователь не найден.");

        //    var userReport = await _context.UsersReports.SingleOrDefaultAsync(report =>
        //        report.GOD == god && report.K_PRED == k_pred && report.Kvartal == kvartal);

        //    if (userReport == null)
        //    {
        //        return NotFound($"Такого отчета не существует: Год-{god}, квартал-{kvartal}, код предприятия-{k_pred}");
        //    }

        //    foreach (var parameter in parameters)
        //    {
        //        var lowercaseParameterName = parameter.Key.ToLower();
        //        if (lowercaseParameterName != "god" && lowercaseParameterName != "kvartal" && lowercaseParameterName != "k_pred")
        //        {
        //            var property = userReport.GetType().GetProperty(lowercaseParameterName);
        //            if (property != null && property.CanWrite
        //                && property.Name.ToLower() != "god"
        //                && property.Name.ToLower() != "kvartal"
        //                && property.Name.ToLower() != "k_pred")
        //            {
        //                switch (property.PropertyType)
        //                {
        //                    case Type boolType when parameter.Value is JsonElement jsonElement
        //                    && (jsonElement.ValueKind == JsonValueKind.True
        //                    || jsonElement.ValueKind == JsonValueKind.False):
        //                        property.SetValue(userReport, jsonElement.GetBoolean());
        //                        break;
        //                    case Type stringType when parameter.Value is JsonElement jsonElement
        //                    && jsonElement.ValueKind == JsonValueKind.String:
        //                        property.SetValue(userReport, jsonElement.GetString());
        //                        break;
        //                    case Type dateTimeType when parameter.Value is JsonElement dateTimeElement
        //                    && dateTimeElement.ValueKind == JsonValueKind.String
        //                    && DateTime.TryParse(dateTimeElement.GetString(), out var dateTimeValue):
        //                        property.SetValue(userReport, dateTimeValue);
        //                        break;
        //                    case Type intType when parameter.Value is JsonElement intElement
        //                    && intElement.ValueKind == JsonValueKind.Number
        //                    && intElement.TryGetInt32(out var intValue):
        //                        property.SetValue(userReport, intValue);
        //                        break;
        //                    default:
        //                        property.SetValue(userReport, parameter.Value);
        //                        break;
        //                }
        //            }
        //        }
        //    }
        //    await _context.SaveChangesAsync();

        //    return userReport;
        //}


        // DELETE: api/UserReport/delete/{god}/{kpred}/{kvartal}
        // Удаление отчёта пользователя по указанным значениям



        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUserReport(int god, int kpred, char kvartal)
        {
            // Проверка валидности переданных параметров
            if (!ValidateParameters(god, kpred, kvartal))
            {
                return Problem("Неверно внесены параметры");
            }

            // Получаем текущего пользователя 
            var user = await _userManager.GetUserAsync(User)
                ?? throw new Exception("Пользователь не найден.");

            // Ищем отчёт пользователя по указанным значениям 
            var userReport = await _context.UsersReports.SingleOrDefaultAsync(
                report => report.GOD == god && report.K_PRED == kpred
                && report.Kvartal == kvartal && report.User.Id == user.Id);

            // Если отчёт не найден, возвращаем ошибку NotFound с сообщением.
            if (userReport == null)
            {
                return NotFound("Такого отчёта не существует");
            }

            // Удаляем отчёт из контекста базы данных.
            _context.UsersReports.Remove(userReport);
            await _context.SaveChangesAsync();

            // Возвращаем ответ NoContent (код 204) без тела ответа.
            return Ok("Отчёт удалён");
        }

        //Проверка, существует ли отчёт с такими параметрами
        private bool UserReportExists(int god, int kpred, char kvartal)
        {
            return _context.UsersReports?.Any(e => e.GOD == god
            && e.K_PRED == kpred && e.Kvartal == kvartal) ?? false;
        }

        //Проверка на нужное количество цифр в параметрах
        private static bool ValidateParameters(int god, int kpred, char kvartal)
        {
            bool isGodValid = Regex.IsMatch(god.ToString(), @"^\d{4}$");
            bool isKpredValid = Regex.IsMatch(kpred.ToString(), @"^\d{8}$");
            bool isKvartalhValid = Regex.IsMatch(kvartal.ToString(), @"^\d{1}$");

            return isGodValid && isKpredValid && isKvartalhValid;
        }
    }

}
