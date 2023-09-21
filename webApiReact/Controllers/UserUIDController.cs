using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApiReact.Models;

namespace webApiReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserUIDController : ControllerBase
    {
        private readonly APIDbContext _context;

        public UserUIDController(APIDbContext context)
        {
            _context = context;
        }

        // GET: api/UserUID
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserUID>>> GetUsersUIDs()
        {
          if (_context.UsersUIDs == null)
          {
              return NotFound();
          }
            return await _context.UsersUIDs.ToListAsync();
        }

        // GET: api/UserUID/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserUID>> GetUserUID(int id)
        {
          if (_context.UsersUIDs == null)
          {
              return NotFound();
          }
            var userUID = await _context.UsersUIDs.FindAsync(id);

            if (userUID == null)
            {
                return NotFound();
            }

            return userUID;
        }

        // PUT: api/UserUID/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserUID(int id, UserUID userUID)
        {
            if (id != userUID.Code)
            {
                return BadRequest();
            }

            _context.Entry(userUID).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserUIDExists(id))
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

        // POST: api/UserUID
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserUID>> PostUserUID(UserUID userUID)
        {
          if (_context.UsersUIDs == null)
          {
              return Problem("Entity set 'APIDbContext.UsersUIDs'  is null.");
          }
            _context.UsersUIDs.Add(userUID);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserUID", new { id = userUID.Code }, userUID);
        }

        // DELETE: api/UserUID/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserUID(int id)
        {
            if (_context.UsersUIDs == null)
            {
                return NotFound();
            }
            var userUID = await _context.UsersUIDs.FindAsync(id);
            if (userUID == null)
            {
                return NotFound();
            }

            _context.UsersUIDs.Remove(userUID);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserUIDExists(int id)
        {
            return (_context.UsersUIDs?.Any(e => e.Code == id)).GetValueOrDefault();
        }
    }
}
