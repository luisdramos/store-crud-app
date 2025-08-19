using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Venta
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Monto { get; set; }

    public DateTime Fecha { get; set; } = DateTime.Now;

    // Clave foránea
    public int PuntoVentaID { get; set; }

    // Propiedad de navegación
    [ForeignKey("PuntoVentaID")]
    public PuntoVenta PuntoVenta { get; set; }
}