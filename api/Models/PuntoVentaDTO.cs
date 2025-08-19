namespace api.Models
{
    public class PuntoVentaDTO
    {
        public int ID { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string Descripcion { get; set; }
        public string Zona { get; set; }
        public decimal TotalVentas { get; set; }
    }
}
