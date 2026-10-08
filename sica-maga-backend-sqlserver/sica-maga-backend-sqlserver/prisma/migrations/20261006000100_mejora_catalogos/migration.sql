-- Mejora de restricciones únicas para catálogos SICA-MAGA

CREATE UNIQUE INDEX [Municipios_codigo_departamentoId_key]
ON [Municipios]([codigo], [departamentoId]);

CREATE UNIQUE INDEX [Comunidades_nombre_municipioId_key]
ON [Comunidades]([nombre], [municipioId]);

CREATE UNIQUE INDEX [Cultivos_nombre_key]
ON [Cultivos]([nombre]);

CREATE UNIQUE INDEX [TiposFertilizantes_nombre_key]
ON [TiposFertilizantes]([nombre]);

CREATE UNIQUE INDEX [Plagas_nombre_key]
ON [Plagas]([nombre]);