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
            var existingCompany = await _context.Companies.SingleOrDefaultAsync(
                targetCompany => targetCompany.K_PRED == kpred);

            if (existingCompany == null)
            {
                return NotFound($"Такого предприятия не существует. Код предприятия: {kpred}");
            }

            company.NAME = existingCompany.NAME;
            company.OKD_3 = existingCompany.OKD_3;

            _context.Entry(existingCompany).CurrentValues.SetValues(company);

            await _context.SaveChangesAsync();

            return existingCompany;
        }

        // POST: api/Company/
        [HttpPost("create")]
        public async Task<ActionResult<Company>> CreateNewCompany(Company company)
        {

            bool companyExists = await CompanyExists(company.K_PRED);
            if (companyExists)
            {
                return NotFound($"Такое предприятие уже существует. Код предприятия:{company.K_PRED}");
            }

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return company;
        }

        private async Task<bool> CompanyExists(int kpred)
        {
            return await _context.Companies.AnyAsync(c => c.K_PRED == kpred);
        }
    }
}
