using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using webApiReact.Models;
using webApiReact.ViewModels;

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
            return companies is null ? NotFound("Предприятий не найдено") : companies;
        }

        // GET: api/Company/5
        [HttpGet("get/{kpred}")]    
        public async Task<ActionResult<Company>> GetСompany(int kpred)
        {
            if (!Regex.IsMatch(kpred.ToString(), @"^\d{8}$"))
            {
                return Problem($"Ошибка ввода Кода предприятия: K_PRED = {kpred}");
            }
            var company = await _context.Companies.FindAsync(kpred);

            return company is null ? NotFound($"Такого предпиятия не существует. Код предприятия: {kpred}") : company;
        }

        // PUT: api/Company/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("update/{kpred}")]
        public async Task<ActionResult<Company>> UpdateCompany(int kpred, Company company)
        {
            var existingCompany = await _context.Companies.SingleOrDefaultAsync(
                targerCompany => targerCompany.K_PRED == kpred);

            if (existingCompany == null)
            {
                return Problem($"Такого предприятия не существует. Код предприятия: {kpred}");
            }

            _context.Entry(existingCompany).CurrentValues.SetValues(company);

            await _context.SaveChangesAsync();

            return existingCompany;
        }

        // POST: api/Company/
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("create")]
        public async Task<ActionResult<Company>> CreateNewCompany(Company company)
        {
            var existingCompany = await _context.Companies.SingleOrDefaultAsync(
                targerCompany => targerCompany.K_PRED == company.K_PRED);

            if (existingCompany != null)
            {
                return Problem($"Такое предприятие уже существует: {company.K_PRED}");
            }

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return company;
        }

        private bool CompanyExists(int kpred)
        {
            return (_context.Companies?.Any(e => e.K_PRED == kpred)).GetValueOrDefault();
        }
    }
}
