using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly AppDbContext _context;

    public VentasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Ventas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VentaDTO>>> GetVentas()
    {
        return await _context.Ventas
            .Select(v => new VentaDTO
            {
                ID = v.ID,
                Monto = v.Monto,
                Fecha = v.Fecha,
                PuntoVentaID = v.PuntoVentaID
            })
            .ToListAsync();
    }

    // GET: api/Ventas/5
    [HttpGet("{id}")]
    public async Task<ActionResult<VentaDTO>> GetVenta(int id)
    {
        var venta = await _context.Ventas.FindAsync(id);

        if (venta == null)
        {
            return NotFound();
        }

        var ventaDto = new VentaDTO
        {
            ID = venta.ID,
            Monto = venta.Monto,
            Fecha = venta.Fecha,
            PuntoVentaID = venta.PuntoVentaID
        };

        return ventaDto;
    }

    // POST: api/Ventas
    [HttpPost]
    public async Task<ActionResult<VentaDTO>> PostVenta(CreateVentaDTO createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar que el punto de venta existe
        var puntoVentaExists = await _context.PuntosVenta.AnyAsync(p => p.ID == createDto.PuntoVentaID);
        if (!puntoVentaExists)
        {
            return BadRequest("El punto de venta especificado no existe");
        }

        var venta = new Venta
        {
            Monto = createDto.Monto,
            PuntoVentaID = createDto.PuntoVentaID,
            Fecha = DateTime.Now
        };

        _context.Ventas.Add(venta);
        await _context.SaveChangesAsync();

        var ventaDto = new VentaDTO
        {
            ID = venta.ID,
            Monto = venta.Monto,
            Fecha = venta.Fecha,
            PuntoVentaID = venta.PuntoVentaID
        };

        return CreatedAtAction(nameof(GetVenta), new { id = venta.ID }, ventaDto);
    }

    // DELETE: api/Ventas/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVenta(int id)
    {
        var venta = await _context.Ventas.FindAsync(id);
        if (venta == null)
        {
            return NotFound();
        }

        _context.Ventas.Remove(venta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Ventas/PuntoVenta/5 (Ventas por punto de venta)
    [HttpGet("PuntoVenta/{puntoVentaId}")]
    public async Task<ActionResult<IEnumerable<VentaDTO>>> GetVentasByPuntoVenta(int puntoVentaId)
    {
        var ventas = await _context.Ventas
            .Where(v => v.PuntoVentaID == puntoVentaId)
            .Select(v => new VentaDTO
            {
                ID = v.ID,
                Monto = v.Monto,
                Fecha = v.Fecha,
                PuntoVentaID = v.PuntoVentaID
            })
            .ToListAsync();

        return ventas;
    }
}
