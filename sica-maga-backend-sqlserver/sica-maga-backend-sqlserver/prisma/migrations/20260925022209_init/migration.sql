BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(50) NOT NULL,
    [descripcion] VARCHAR(255),
    CONSTRAINT [Roles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Roles_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Departamentos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(10) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    CONSTRAINT [Departamentos_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Departamentos_codigo_key] UNIQUE NONCLUSTERED ([codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Municipios] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(10) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    [departamentoId] INT NOT NULL,
    CONSTRAINT [Municipios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Comunidades] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100) NOT NULL,
    [municipioId] INT NOT NULL,
    CONSTRAINT [Comunidades_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Usuarios] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100) NOT NULL,
    [correo] VARCHAR(100) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [Usuarios_activo_df] DEFAULT 1,
    [rolId] INT NOT NULL,
    [departamentoId] INT,
    [municipioId] INT,
    CONSTRAINT [Usuarios_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuarios_correo_key] UNIQUE NONCLUSTERED ([correo])
);

-- CreateTable
CREATE TABLE [dbo].[RefreshTokens] (
    [id] INT NOT NULL IDENTITY(1,1),
    [token] VARCHAR(500) NOT NULL,
    [usuarioId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefreshTokens_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefreshTokens_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefreshTokens_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[Productores] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cui] VARCHAR(13) NOT NULL,
    [nombres] VARCHAR(100) NOT NULL,
    [apellidos] VARCHAR(100) NOT NULL,
    [telefono] VARCHAR(20),
    [direccion] VARCHAR(255),
    [cooperativa] VARCHAR(150),
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [Productores_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [departamentoId] INT NOT NULL,
    [municipioId] INT NOT NULL,
    [comunidadId] INT,
    CONSTRAINT [Productores_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Productores_cui_key] UNIQUE NONCLUSTERED ([cui])
);

-- CreateTable
CREATE TABLE [dbo].[Parcelas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo] VARCHAR(50) NOT NULL,
    [extension] DECIMAL(10,2) NOT NULL,
    [tenenciaTierra] VARCHAR(50) NOT NULL,
    [latitud] FLOAT(53) NOT NULL,
    [longitud] FLOAT(53) NOT NULL,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [Parcelas_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [productorId] INT NOT NULL,
    [departamentoId] INT NOT NULL,
    [municipioId] INT NOT NULL,
    CONSTRAINT [Parcelas_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Parcelas_codigo_key] UNIQUE NONCLUSTERED ([codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Cultivos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100) NOT NULL,
    [descripcion] VARCHAR(255),
    CONSTRAINT [Cultivos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cosechas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [temporada] VARCHAR(50) NOT NULL,
    [produccionEst] DECIMAL(10,2) NOT NULL,
    [produccionReal] DECIMAL(10,2),
    [fechaSiembra] DATETIME2 NOT NULL,
    [fechaCosecha] DATETIME2,
    [parcelaId] INT NOT NULL,
    [cultivoId] INT NOT NULL,
    CONSTRAINT [Cosechas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TiposFertilizantes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100) NOT NULL,
    CONSTRAINT [TiposFertilizantes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Fertilizaciones] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cantidad] DECIMAL(10,2) NOT NULL,
    [fechaAplicacion] DATETIME2 NOT NULL,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [Fertilizaciones_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [parcelaId] INT NOT NULL,
    [cosechaId] INT,
    [fertilizanteId] INT NOT NULL,
    CONSTRAINT [Fertilizaciones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Plagas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] VARCHAR(100) NOT NULL,
    CONSTRAINT [Plagas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Incidencias] (
    [id] INT NOT NULL IDENTITY(1,1),
    [descripcion] VARCHAR(255) NOT NULL,
    [severidad] VARCHAR(50) NOT NULL,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [Incidencias_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [parcelaId] INT NOT NULL,
    [cosechaId] INT,
    [plagaId] INT,
    CONSTRAINT [Incidencias_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Municipios] ADD CONSTRAINT [Municipios_departamentoId_fkey] FOREIGN KEY ([departamentoId]) REFERENCES [dbo].[Departamentos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comunidades] ADD CONSTRAINT [Comunidades_municipioId_fkey] FOREIGN KEY ([municipioId]) REFERENCES [dbo].[Municipios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuarios] ADD CONSTRAINT [Usuarios_rolId_fkey] FOREIGN KEY ([rolId]) REFERENCES [dbo].[Roles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuarios] ADD CONSTRAINT [Usuarios_departamentoId_fkey] FOREIGN KEY ([departamentoId]) REFERENCES [dbo].[Departamentos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuarios] ADD CONSTRAINT [Usuarios_municipioId_fkey] FOREIGN KEY ([municipioId]) REFERENCES [dbo].[Municipios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefreshTokens] ADD CONSTRAINT [RefreshTokens_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Productores] ADD CONSTRAINT [Productores_departamentoId_fkey] FOREIGN KEY ([departamentoId]) REFERENCES [dbo].[Departamentos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Productores] ADD CONSTRAINT [Productores_municipioId_fkey] FOREIGN KEY ([municipioId]) REFERENCES [dbo].[Municipios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Productores] ADD CONSTRAINT [Productores_comunidadId_fkey] FOREIGN KEY ([comunidadId]) REFERENCES [dbo].[Comunidades]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Parcelas] ADD CONSTRAINT [Parcelas_productorId_fkey] FOREIGN KEY ([productorId]) REFERENCES [dbo].[Productores]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Parcelas] ADD CONSTRAINT [Parcelas_departamentoId_fkey] FOREIGN KEY ([departamentoId]) REFERENCES [dbo].[Departamentos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Parcelas] ADD CONSTRAINT [Parcelas_municipioId_fkey] FOREIGN KEY ([municipioId]) REFERENCES [dbo].[Municipios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cosechas] ADD CONSTRAINT [Cosechas_parcelaId_fkey] FOREIGN KEY ([parcelaId]) REFERENCES [dbo].[Parcelas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cosechas] ADD CONSTRAINT [Cosechas_cultivoId_fkey] FOREIGN KEY ([cultivoId]) REFERENCES [dbo].[Cultivos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fertilizaciones] ADD CONSTRAINT [Fertilizaciones_parcelaId_fkey] FOREIGN KEY ([parcelaId]) REFERENCES [dbo].[Parcelas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fertilizaciones] ADD CONSTRAINT [Fertilizaciones_cosechaId_fkey] FOREIGN KEY ([cosechaId]) REFERENCES [dbo].[Cosechas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Fertilizaciones] ADD CONSTRAINT [Fertilizaciones_fertilizanteId_fkey] FOREIGN KEY ([fertilizanteId]) REFERENCES [dbo].[TiposFertilizantes]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Incidencias] ADD CONSTRAINT [Incidencias_parcelaId_fkey] FOREIGN KEY ([parcelaId]) REFERENCES [dbo].[Parcelas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Incidencias] ADD CONSTRAINT [Incidencias_cosechaId_fkey] FOREIGN KEY ([cosechaId]) REFERENCES [dbo].[Cosechas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Incidencias] ADD CONSTRAINT [Incidencias_plagaId_fkey] FOREIGN KEY ([plagaId]) REFERENCES [dbo].[Plagas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
