namespace api.Models
{
    public class PuntoVentaDetailDTO
    {
        public int ID { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string Descripcion { get; set; }
        public string Zona { get; set; }
        public List<VentaDTO> Ventas { get; set; }
        public decimal TotalVentas => Ventas?.Sum(v => v.Monto) ?? 0;
    }   
}
