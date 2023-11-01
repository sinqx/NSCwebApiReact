using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using webApiReact.Models;

namespace webApiReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly APIDbContext _context;

        public CompanyController(APIDbContext context)
        {
            _context = context;
        }

        // GET: api/Companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            var companies = await _context.Companies.ToListAsync();
            return companies is null || companies.Count == 0 ? NotFound("Предприятий не найдено") : companies;
        }

        // GET: api/Company/5
        [HttpGet("get/{kpred}")]
        public async Task<ActionResult<Company>> GetСompany(int kpred)
        {
            if (!Regex.IsMatch(kpred.ToString(), @"^\d{8}$"))
            {
                return BadRequest($"Ошибка ввода Кода предприятия: K_PRED = {kpred}");
            }
            var company = await _context.Companies.FindAsync(kpred);

            return company is null ? NotFound($"Такого предпиятия не существует. Код предприятия: {kpred}") : company;
        }

        // PUT: api/Company/update/5
        [HttpPut("update/{kpred}")]
        public async Task<ActionResult<Company>> UpdateCompany(int kpred, Company company)
        {
            var udpateCompany = await _context.Companies.SingleOrDefaultAsync(
                targetCompany => targetCompany.K_PRED == kpred);

            if (udpateCompany == null)
            {
                return NotFound($"Такого предприятия не существует. Код предприятия: {kpred}");
            }

            company.NAME = udpateCompany.NAME;
            company.OKD_3 = udpateCompany.OKD_3;

            _context.Entry(udpateCompany).CurrentValues.SetValues(company);

            await _context.SaveChangesAsync();

            return udpateCompany;
        }

        // POST: api/Company/
        [HttpPost("create")]
        public async Task<ActionResult<Company>> CreateNewCompany(Company company)
        {

            if (await _context.Companies.AnyAsync(c => c.K_PRED == company.K_PRED))
            {
                return NotFound($"Такое предприятие уже существует. Код предприятия:{company.K_PRED}");
            }

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return Ok("Предприятие создано:\n" + company);
        }

        //DELTE: api/Company/delete
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteCompany(int kpred)
        {
            if (kpred.ToString().Length != 8)
            {
                return BadRequest($"Неверно введен код предприятия: {kpred}");
            }

            var company = await _context.Companies.SingleOrDefaultAsync(
                targetCompany => targetCompany.K_PRED == kpred);

            // Если отчёт не найден, возвращаем ошибку NotFound с сообщением.
            if (company == null)
            {
                return NotFound("Такого предприятия не существует не существует");
            }

            // Удаляем отчёт из контекста базы данных.
            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            // Возвращаем ответ NoContent (код 204) без тела ответа.
            return Ok("Предприятие удалено");
        }
    }
}
