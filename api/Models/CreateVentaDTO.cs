using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class CreateVentaDTO
    {
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "El monto debe ser mayor o igual a 0")]
        public decimal Monto { get; set; }

        [Required]
        public int PuntoVentaID { get; set; }
    }
}
