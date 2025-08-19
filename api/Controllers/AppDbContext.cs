using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<PuntoVenta> PuntosVenta { get; set; }
    public DbSet<Venta> Ventas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurar nombres de tablas explícitamente
        modelBuilder.Entity<PuntoVenta>().ToTable("PuntoVenta", "dbo");
        modelBuilder.Entity<Venta>().ToTable("Venta", "dbo");

        // Configurar relaciones
        modelBuilder.Entity<Venta>()
            .HasOne(v => v.PuntoVenta)
            .WithMany(p => p.Ventas)
            .HasForeignKey(v => v.PuntoVentaID);

        base.OnModelCreating(modelBuilder);
    }
}