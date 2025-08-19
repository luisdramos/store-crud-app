using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class CreatePuntoVentaDTO
    {
        [Required]
        [Range(-90, 90, ErrorMessage = "La latitud debe estar entre -90 y 90")]
        public decimal Latitud { get; set; }

        [Required]
        [Range(-180, 180, ErrorMessage = "La longitud debe estar entre -180 y 180")]
        public decimal Longitud { get; set; }

        [Required]
        [MaxLength(255)]
        public string Descripcion { get; set; }

        [Required]
        [MaxLength(100)]
        public string Zona { get; set; }
    }
}
