using api.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PuntoVenta
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    [Required]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Latitud { get; set; }

    [Required]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Longitud { get; set; }

    [Required]
    [MaxLength(255)]
    public string Descripcion { get; set; }

    [Required]
    [MaxLength(100)]
    public string Zona { get; set; }

    // Relación uno a muchos con Venta
    public ICollection<Venta> Ventas { get; set; }

    // Propiedad calculada para la suma de ventas
    [NotMapped]
    public decimal TotalVentas => Ventas?.Sum(v => v.Monto) ?? 0;
}