namespace api.Models
{
    public class VentaDTO
    {
        public int ID { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        public int PuntoVentaID { get; set; }
    }
}
