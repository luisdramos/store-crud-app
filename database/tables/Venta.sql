CREATE TABLE Venta (
    ID INT IDENTITY(1,1) PRIMARY KEY,    -- Identificador único (auto incremental)
    PuntoVentaID INT,                    -- Clave foránea que referencia a PuntoVenta
    Monto DECIMAL(18, 2),                -- Valor numérico de la venta
    Fecha DATETIME DEFAULT GETDATE(),    -- Fecha y hora de la venta
    FOREIGN KEY (PuntoVentaID) REFERENCES PuntoVenta(ID)  -- Relación con PuntoVenta
);