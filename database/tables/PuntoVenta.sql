CREATE TABLE PuntoVenta (
    ID INT IDENTITY(1,1) PRIMARY KEY,  -- Identificador único (auto incremental)
    Latitud DECIMAL(9, 6),              -- Coordenada geográfica
    Longitud DECIMAL(9, 6),             -- Coordenada geográfica
    Descripcion NVARCHAR(255),          -- Nombre del punto de interés
    Zona NVARCHAR(100)                   -- Agrupador geográfico (ej. Zona Norte)
);