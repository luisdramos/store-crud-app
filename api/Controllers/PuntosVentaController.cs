using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PuntosVentaController : ControllerBase
{
    private readonly AppDbContext _context;
    public PuntosVentaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PuntoVentaDTO>>> GetPuntosVenta()
    {
        return await _context.PuntosVenta
            .Select(p => new PuntoVentaDTO
            {
                ID = p.ID,
                Latitud = p.Latitud,
                Longitud = p.Longitud,
                Descripcion = p.Descripcion,
                Zona = p.Zona,
                TotalVentas = p.Ventas.Sum(v => v.Monto)
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PuntoVentaDetailDTO>> GetPuntoVenta(int id)
    {
        var puntoVenta = await _context.PuntosVenta
            .Include(p => p.Ventas)
            .FirstOrDefaultAsync(p => p.ID == id);

        if (puntoVenta == null)
        {
            return NotFound();
        }

        var dto = new PuntoVentaDetailDTO
        {
            ID = puntoVenta.ID,
            Latitud = puntoVenta.Latitud,
            Longitud = puntoVenta.Longitud,
            Descripcion = puntoVenta.Descripcion,
            Zona = puntoVenta.Zona,
            Ventas = puntoVenta.Ventas.Select(v => new VentaDTO
            {
                ID = v.ID,
                Monto = v.Monto,
                Fecha = v.Fecha,
                PuntoVentaID = v.PuntoVentaID
            }).ToList()
        };

        return dto;
    }

    [HttpPost]
    public async Task<ActionResult<PuntoVentaDTO>> PostPuntoVenta(CreatePuntoVentaDTO createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var puntoVenta = new PuntoVenta
        {
            Latitud = createDto.Latitud,
            Longitud = createDto.Longitud,
            Descripcion = createDto.Descripcion,
            Zona = createDto.Zona
        };

        _context.PuntosVenta.Add(puntoVenta);
        await _context.SaveChangesAsync();

        var puntoVentaDto = new PuntoVentaDTO
        {
            ID = puntoVenta.ID,
            Latitud = puntoVenta.Latitud,
            Longitud = puntoVenta.Longitud,
            Descripcion = puntoVenta.Descripcion,
            Zona = puntoVenta.Zona,
            TotalVentas = 0 // Nuevo punto de venta, sin ventas aún
        };

        return CreatedAtAction(nameof(GetPuntoVenta), new { id = puntoVenta.ID }, puntoVentaDto);
    }

    // DELETE: api/PuntosVenta/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePuntoVenta(int id)
    {
        var puntoVenta = await _context.PuntosVenta.FindAsync(id);
        if (puntoVenta == null)
        {
            return NotFound();
        }

        _context.PuntosVenta.Remove(puntoVenta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPuntoVenta(int id, CreatePuntoVentaDTO updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var puntoVenta = await _context.PuntosVenta.FindAsync(id);
        if (puntoVenta == null)
        {
            return NotFound();
        }

        puntoVenta.Latitud = updateDto.Latitud;
        puntoVenta.Longitud = updateDto.Longitud;
        puntoVenta.Descripcion = updateDto.Descripcion;
        puntoVenta.Zona = updateDto.Zona;

        _context.Entry(puntoVenta).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PuntoVentaExists(id))
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

    private bool PuntoVentaExists(int id)
    {
        return _context.PuntosVenta.Any(e => e.ID == id);
    }

}