SET NOCOUNT ON;
SET XACT_ABORT ON;

USE [MAGA_DB];

BEGIN TRY
    BEGIN TRANSACTION;

    PRINT N'1/3 Cargando 22 departamentos...';

    MERGE INTO dbo.Departamentos AS target
    USING (VALUES
(N'01', N'Guatemala'),
(N'02', N'El Progreso'),
(N'03', N'Sacatepéquez'),
(N'04', N'Chimaltenango'),
(N'05', N'Escuintla'),
(N'06', N'Santa Rosa'),
(N'07', N'Sololá'),
(N'08', N'Totonicapán'),
(N'09', N'Quetzaltenango'),
(N'10', N'Suchitepéquez'),
(N'11', N'Retalhuleu'),
(N'12', N'San Marcos'),
(N'13', N'Huehuetenango'),
(N'14', N'Quiché'),
(N'15', N'Baja Verapaz'),
(N'16', N'Alta Verapaz'),
(N'17', N'Petén'),
(N'18', N'Izabal'),
(N'19', N'Zacapa'),
(N'20', N'Chiquimula'),
(N'21', N'Jalapa'),
(N'22', N'Jutiapa')
    ) AS source(codigo, nombre)
    ON target.codigo = source.codigo
    WHEN MATCHED THEN
        UPDATE SET nombre = source.nombre
    WHEN NOT MATCHED THEN
        INSERT (codigo, nombre) VALUES (source.codigo, source.nombre);

    PRINT N'2/3 Cargando 340 municipios...';

    ;WITH FuenteMunicipios AS (
        SELECT codigo, departamentoCodigo, nombre
        FROM (VALUES
(N'0101', N'01', N'Guatemala'),
(N'0102', N'01', N'Santa Catarina Pinula'),
(N'0103', N'01', N'San José Pinula'),
(N'0104', N'01', N'San José del Golfo'),
(N'0105', N'01', N'Palencia'),
(N'0106', N'01', N'Chinautla'),
(N'0107', N'01', N'San Pedro Ayampuc'),
(N'0108', N'01', N'Mixco'),
(N'0109', N'01', N'San Pedro Sacatepéquez'),
(N'0110', N'01', N'San Juan Sacatepéquez'),
(N'0111', N'01', N'San Raymundo'),
(N'0112', N'01', N'Chuarrancho'),
(N'0113', N'01', N'Fraijanes'),
(N'0114', N'01', N'Amatitlán'),
(N'0115', N'01', N'Villa Nueva'),
(N'0116', N'01', N'Villa Canales'),
(N'0117', N'01', N'San Miguel Petapa'),
(N'0201', N'02', N'Guastatoya'),
(N'0202', N'02', N'Morazán'),
(N'0203', N'02', N'San Agustín Acasaguastlán'),
(N'0204', N'02', N'San Cristóbal Acasaguastlán'),
(N'0205', N'02', N'El Jícaro'),
(N'0206', N'02', N'Sansare'),
(N'0207', N'02', N'Sanarate'),
(N'0208', N'02', N'San Antonio La Paz'),
(N'0301', N'03', N'Antigua Guatemala'),
(N'0302', N'03', N'Jocotenango'),
(N'0303', N'03', N'Pastores'),
(N'0304', N'03', N'Sumpango'),
(N'0305', N'03', N'Santo Domingo Xenacoj'),
(N'0306', N'03', N'Santiago Sacatepéquez'),
(N'0307', N'03', N'San Bartolomé Milpas Altas'),
(N'0308', N'03', N'San Lucas Sacatepéquez'),
(N'0309', N'03', N'Santa Lucía Milpas Altas'),
(N'0310', N'03', N'Magdalena Milpas Altas'),
(N'0311', N'03', N'Santa María de Jesús'),
(N'0312', N'03', N'Ciudad Vieja'),
(N'0313', N'03', N'San Miguel Dueñas'),
(N'0314', N'03', N'Alotenango'),
(N'0315', N'03', N'San Antonio Aguas Calientes'),
(N'0316', N'03', N'Santa Catarina Barahona'),
(N'0401', N'04', N'Chimaltenango'),
(N'0402', N'04', N'San José Poaquil'),
(N'0403', N'04', N'San Martín Jilotepeque'),
(N'0404', N'04', N'San Juan Comalapa'),
(N'0405', N'04', N'Santa Apolonia'),
(N'0406', N'04', N'Tecpán Guatemala'),
(N'0407', N'04', N'Patzún'),
(N'0408', N'04', N'Pochuta'),
(N'0409', N'04', N'Patzicía'),
(N'0410', N'04', N'Santa Cruz Balanyá'),
(N'0411', N'04', N'Acatenango'),
(N'0412', N'04', N'Yepocapa'),
(N'0413', N'04', N'San Andrés Itzapa'),
(N'0414', N'04', N'Parramos'),
(N'0415', N'04', N'Zaragoza'),
(N'0416', N'04', N'El Tejar'),
(N'0501', N'05', N'Escuintla'),
(N'0502', N'05', N'Santa Lucía Cotzumalguapa'),
(N'0503', N'05', N'La Democracia'),
(N'0504', N'05', N'Siquinalá'),
(N'0505', N'05', N'Masagua'),
(N'0506', N'05', N'Tiquisate'),
(N'0507', N'05', N'La Gomera'),
(N'0508', N'05', N'Guanagazapa'),
(N'0509', N'05', N'San José'),
(N'0510', N'05', N'Iztapa'),
(N'0511', N'05', N'Palín'),
(N'0512', N'05', N'San Vicente Pacaya'),
(N'0513', N'05', N'Nueva Concepción'),
(N'0514', N'05', N'Sipacate'),
(N'0601', N'06', N'Cuilapa'),
(N'0602', N'06', N'Barberena'),
(N'0603', N'06', N'Santa Rosa de Lima'),
(N'0604', N'06', N'Casillas'),
(N'0605', N'06', N'San Rafael Las Flores'),
(N'0606', N'06', N'Oratorio'),
(N'0607', N'06', N'San Juan Tecuaco'),
(N'0608', N'06', N'Chiquimulilla'),
(N'0609', N'06', N'Taxisco'),
(N'0610', N'06', N'Santa María Ixhuatán'),
(N'0611', N'06', N'Guazacapán'),
(N'0612', N'06', N'Santa Cruz Naranjo'),
(N'0613', N'06', N'Pueblo Nuevo Viñas'),
(N'0614', N'06', N'Nueva Santa Rosa'),
(N'0701', N'07', N'Sololá'),
(N'0702', N'07', N'San José Chacayá'),
(N'0703', N'07', N'Santa María Visitación'),
(N'0704', N'07', N'Santa Lucía Utatlán'),
(N'0705', N'07', N'Nahualá'),
(N'0706', N'07', N'Santa Catarina Ixtahuacán'),
(N'0707', N'07', N'Santa Clara La Laguna'),
(N'0708', N'07', N'Concepción'),
(N'0709', N'07', N'San Andrés Semetabaj'),
(N'0710', N'07', N'Panajachel'),
(N'0711', N'07', N'Santa Catarina Palopó'),
(N'0712', N'07', N'San Antonio Palopó'),
(N'0713', N'07', N'San Lucas Tolimán'),
(N'0714', N'07', N'Santa Cruz La Laguna'),
(N'0715', N'07', N'San Pablo La Laguna'),
(N'0716', N'07', N'San Marcos La Laguna'),
(N'0717', N'07', N'San Juan La Laguna'),
(N'0718', N'07', N'San Pedro La Laguna'),
(N'0719', N'07', N'Santiago Atitlán'),
(N'0801', N'08', N'Totonicapán'),
(N'0802', N'08', N'San Cristóbal Totonicapán'),
(N'0803', N'08', N'San Francisco El Alto'),
(N'0804', N'08', N'San Andrés Xecul'),
(N'0805', N'08', N'Momostenango'),
(N'0806', N'08', N'Santa María Chiquimula'),
(N'0807', N'08', N'Santa Lucía La Reforma'),
(N'0808', N'08', N'San Bartolo Aguas Calientes'),
(N'0901', N'09', N'Quetzaltenango'),
(N'0902', N'09', N'Salcajá'),
(N'0903', N'09', N'Olintepeque'),
(N'0904', N'09', N'San Carlos Sija'),
(N'0905', N'09', N'Sibilia'),
(N'0906', N'09', N'Cabricán'),
(N'0907', N'09', N'Cajolá'),
(N'0908', N'09', N'San Miguel Sigüilá'),
(N'0909', N'09', N'San Juan Ostuncalco'),
(N'0910', N'09', N'San Mateo'),
(N'0911', N'09', N'Concepción Chiquirichapa'),
(N'0912', N'09', N'San Martín Sacatepéquez'),
(N'0913', N'09', N'Almolonga'),
(N'0914', N'09', N'Cantel'),
(N'0915', N'09', N'Huitán'),
(N'0916', N'09', N'Zunil'),
(N'0917', N'09', N'Colomba Costa Cuca'),
(N'0918', N'09', N'San Francisco La Unión'),
(N'0919', N'09', N'El Palmar'),
(N'0920', N'09', N'Coatepeque'),
(N'0921', N'09', N'Génova Costa Cuca'),
(N'0922', N'09', N'Flores Costa Cuca'),
(N'0923', N'09', N'La Esperanza'),
(N'0924', N'09', N'Palestina de Los Altos'),
(N'1001', N'10', N'Mazatenango'),
(N'1002', N'10', N'Cuyotenango'),
(N'1003', N'10', N'San Francisco Zapotitlán'),
(N'1004', N'10', N'San Bernardino'),
(N'1005', N'10', N'San José El Ídolo'),
(N'1006', N'10', N'Santo Domingo Suchitepéquez'),
(N'1007', N'10', N'San Lorenzo'),
(N'1008', N'10', N'Samayac'),
(N'1009', N'10', N'San Pablo Jocopilas'),
(N'1010', N'10', N'San Antonio Suchitepéquez'),
(N'1011', N'10', N'San Miguel Panán'),
(N'1012', N'10', N'San Gabriel'),
(N'1013', N'10', N'Chicacao'),
(N'1014', N'10', N'Patulul'),
(N'1015', N'10', N'Santa Bárbara'),
(N'1016', N'10', N'San Juan Bautista'),
(N'1017', N'10', N'Santo Tomás La Unión'),
(N'1018', N'10', N'Zunilito'),
(N'1019', N'10', N'Pueblo Nuevo'),
(N'1020', N'10', N'Río Bravo'),
(N'1021', N'10', N'San José La Máquina'),
(N'1101', N'11', N'Retalhuleu'),
(N'1102', N'11', N'San Sebastián'),
(N'1103', N'11', N'Santa Cruz Muluá'),
(N'1104', N'11', N'San Martín Zapotitlán'),
(N'1105', N'11', N'San Felipe'),
(N'1106', N'11', N'San Andrés Villa Seca'),
(N'1107', N'11', N'Champerico'),
(N'1108', N'11', N'Nuevo San Carlos'),
(N'1109', N'11', N'El Asintal'),
(N'1201', N'12', N'San Marcos'),
(N'1202', N'12', N'San Pedro Sacatepéquez'),
(N'1203', N'12', N'San Antonio Sacatepéquez'),
(N'1204', N'12', N'Comitancillo'),
(N'1205', N'12', N'San Miguel Ixtahuacán'),
(N'1206', N'12', N'Concepción Tutuapa'),
(N'1207', N'12', N'Tacaná'),
(N'1208', N'12', N'Sibinal'),
(N'1209', N'12', N'Tajumulco'),
(N'1210', N'12', N'Tejutla'),
(N'1211', N'12', N'San Rafael Pie de la Cuesta'),
(N'1212', N'12', N'Nuevo Progreso'),
(N'1213', N'12', N'El Tumbador'),
(N'1214', N'12', N'El Rodeo'),
(N'1215', N'12', N'Malacatán'),
(N'1216', N'12', N'Catarina'),
(N'1217', N'12', N'Ayutla'),
(N'1218', N'12', N'Ocós'),
(N'1219', N'12', N'San Pablo'),
(N'1220', N'12', N'El Quetzal'),
(N'1221', N'12', N'La Reforma'),
(N'1222', N'12', N'Pajapita'),
(N'1223', N'12', N'Ixchiguán'),
(N'1224', N'12', N'San José Ojetenam'),
(N'1225', N'12', N'San Cristóbal Cucho'),
(N'1226', N'12', N'Sipacapa'),
(N'1227', N'12', N'Esquipulas Palo Gordo'),
(N'1228', N'12', N'Río Blanco'),
(N'1229', N'12', N'San Lorenzo'),
(N'1230', N'12', N'La Blanca'),
(N'1301', N'13', N'Huehuetenango'),
(N'1302', N'13', N'Chiantla'),
(N'1303', N'13', N'Malacatancito'),
(N'1304', N'13', N'Cuilco'),
(N'1305', N'13', N'Nentón'),
(N'1306', N'13', N'San Pedro Necta'),
(N'1307', N'13', N'Jacaltenango'),
(N'1308', N'13', N'San Pedro Soloma'),
(N'1309', N'13', N'San Ildefonso Ixtahuacán'),
(N'1310', N'13', N'Santa Bárbara'),
(N'1311', N'13', N'La Libertad'),
(N'1312', N'13', N'La Democracia'),
(N'1313', N'13', N'San Miguel Acatán'),
(N'1314', N'13', N'San Rafael La Independencia'),
(N'1315', N'13', N'Todos Santos Cuchumatán'),
(N'1316', N'13', N'San Juan Atitán'),
(N'1317', N'13', N'Santa Eulalia'),
(N'1318', N'13', N'San Mateo Ixtatán'),
(N'1319', N'13', N'Colotenango'),
(N'1320', N'13', N'San Sebastián Huehuetenango'),
(N'1321', N'13', N'Tectitán'),
(N'1322', N'13', N'Concepción Huista'),
(N'1323', N'13', N'San Juan Ixcoy'),
(N'1324', N'13', N'San Antonio Huista'),
(N'1325', N'13', N'San Sebastián Coatán'),
(N'1326', N'13', N'Santa Cruz Barillas'),
(N'1327', N'13', N'Aguacatán'),
(N'1328', N'13', N'San Rafael Petzal'),
(N'1329', N'13', N'San Gaspar Ixchil'),
(N'1330', N'13', N'Santiago Chimaltenango'),
(N'1331', N'13', N'Santa Ana Huista'),
(N'1332', N'13', N'Unión Cantinil'),
(N'1333', N'13', N'Petatán'),
(N'1401', N'14', N'Santa Cruz del Quiché'),
(N'1402', N'14', N'Chiché'),
(N'1403', N'14', N'Chinique'),
(N'1404', N'14', N'Zacualpa'),
(N'1405', N'14', N'Chajul'),
(N'1406', N'14', N'Chichicastenango'),
(N'1407', N'14', N'Patzité'),
(N'1408', N'14', N'San Antonio Ilotenango'),
(N'1409', N'14', N'San Pedro Jocopilas'),
(N'1410', N'14', N'Cunén'),
(N'1411', N'14', N'San Juan Cotzal'),
(N'1412', N'14', N'Joyabaj'),
(N'1413', N'14', N'Nebaj'),
(N'1414', N'14', N'San Andrés Sajcabajá'),
(N'1415', N'14', N'Uspantán'),
(N'1416', N'14', N'Sacapulas'),
(N'1417', N'14', N'San Bartolomé Jocotenango'),
(N'1418', N'14', N'Canillá'),
(N'1419', N'14', N'Chicamán'),
(N'1420', N'14', N'Ixcán'),
(N'1421', N'14', N'Pachalum'),
(N'1501', N'15', N'Salamá'),
(N'1502', N'15', N'San Miguel Chicaj'),
(N'1503', N'15', N'Rabinal'),
(N'1504', N'15', N'Cubulco'),
(N'1505', N'15', N'Granados'),
(N'1506', N'15', N'Santa Cruz El Chol'),
(N'1507', N'15', N'San Jerónimo'),
(N'1508', N'15', N'Purulhá'),
(N'1601', N'16', N'Cobán'),
(N'1602', N'16', N'Santa Cruz Verapaz'),
(N'1603', N'16', N'San Cristóbal Verapaz'),
(N'1604', N'16', N'Tactic'),
(N'1605', N'16', N'Tamahú'),
(N'1606', N'16', N'Tucurú'),
(N'1607', N'16', N'Panzós'),
(N'1608', N'16', N'Senahú'),
(N'1609', N'16', N'San Pedro Carchá'),
(N'1610', N'16', N'San Juan Chamelco'),
(N'1611', N'16', N'Lanquín'),
(N'1612', N'16', N'Santa María Cahabón'),
(N'1613', N'16', N'Chisec'),
(N'1614', N'16', N'Chahal'),
(N'1615', N'16', N'Fray Bartolomé de las Casas'),
(N'1616', N'16', N'Santa Catalina La Tinta'),
(N'1617', N'16', N'Raxruhá'),
(N'1701', N'17', N'Flores'),
(N'1702', N'17', N'San José'),
(N'1703', N'17', N'San Benito'),
(N'1704', N'17', N'San Andrés'),
(N'1705', N'17', N'La Libertad'),
(N'1706', N'17', N'San Francisco'),
(N'1707', N'17', N'Santa Ana'),
(N'1708', N'17', N'Dolores'),
(N'1709', N'17', N'San Luis'),
(N'1710', N'17', N'Sayaxché'),
(N'1711', N'17', N'Melchor de Mencos'),
(N'1712', N'17', N'Poptún'),
(N'1713', N'17', N'Las Cruces'),
(N'1714', N'17', N'El Chal'),
(N'1801', N'18', N'Puerto Barrios'),
(N'1802', N'18', N'Livingston'),
(N'1803', N'18', N'El Estor'),
(N'1804', N'18', N'Morales'),
(N'1805', N'18', N'Los Amates'),
(N'1901', N'19', N'Zacapa'),
(N'1902', N'19', N'Estanzuela'),
(N'1903', N'19', N'Río Hondo'),
(N'1904', N'19', N'Gualán'),
(N'1905', N'19', N'Teculután'),
(N'1906', N'19', N'Usumatlán'),
(N'1907', N'19', N'Cabañas'),
(N'1908', N'19', N'San Diego'),
(N'1909', N'19', N'La Unión'),
(N'1910', N'19', N'Huité'),
(N'1911', N'19', N'San Jorge'),
(N'2001', N'20', N'Chiquimula'),
(N'2002', N'20', N'San José La Arada'),
(N'2003', N'20', N'San Juan Ermita'),
(N'2004', N'20', N'Jocotán'),
(N'2005', N'20', N'Camotán'),
(N'2006', N'20', N'Olopa'),
(N'2007', N'20', N'Esquipulas'),
(N'2008', N'20', N'Concepción Las Minas'),
(N'2009', N'20', N'Quezaltepeque'),
(N'2010', N'20', N'San Jacinto'),
(N'2011', N'20', N'Ipala'),
(N'2101', N'21', N'Jalapa'),
(N'2102', N'21', N'San Pedro Pinula'),
(N'2103', N'21', N'San Luis Jilotepeque'),
(N'2104', N'21', N'San Manuel Chaparrón'),
(N'2105', N'21', N'San Carlos Alzatate'),
(N'2106', N'21', N'Monjas'),
(N'2107', N'21', N'Mataquescuintla'),
(N'2201', N'22', N'Jutiapa'),
(N'2202', N'22', N'El Progreso'),
(N'2203', N'22', N'Santa Catarina Mita'),
(N'2204', N'22', N'Agua Blanca'),
(N'2205', N'22', N'Asunción Mita'),
(N'2206', N'22', N'Yupiltepeque'),
(N'2207', N'22', N'Atescatempa'),
(N'2208', N'22', N'Jerez'),
(N'2209', N'22', N'El Adelanto'),
(N'2210', N'22', N'Zapotitlán'),
(N'2211', N'22', N'Comapa'),
(N'2212', N'22', N'Jalpatagua'),
(N'2213', N'22', N'Conguaco'),
(N'2214', N'22', N'Moyuta'),
(N'2215', N'22', N'Pasaco'),
(N'2216', N'22', N'San José Acatempa'),
(N'2217', N'22', N'Quesada')
        ) AS v(codigo, departamentoCodigo, nombre)
    ),
    DatosMunicipios AS (
        SELECT
            f.codigo,
            f.nombre,
            d.id AS departamentoId
        FROM FuenteMunicipios f
        INNER JOIN dbo.Departamentos d
            ON d.codigo = f.departamentoCodigo
    )
    MERGE INTO dbo.Municipios AS target
    USING DatosMunicipios AS source
    ON target.codigo = source.codigo
       AND target.departamentoId = source.departamentoId
    WHEN MATCHED THEN
        UPDATE SET nombre = source.nombre
    WHEN NOT MATCHED THEN
        INSERT (codigo, nombre, departamentoId)
        VALUES (source.codigo, source.nombre, source.departamentoId);

    PRINT N'3/3 Cargando 22 zonas de la Ciudad de Guatemala en Comunidades...';

    DECLARE @MunicipioGuatemalaId INT =
    (
        SELECT TOP 1 m.id
        FROM dbo.Municipios m
        INNER JOIN dbo.Departamentos d ON d.id = m.departamentoId
        WHERE d.codigo = N'01'
          AND m.codigo = N'0101'
    );

    IF @MunicipioGuatemalaId IS NULL
        THROW 51000, 'No se encontró el municipio Guatemala (0101).', 1;

    MERGE INTO dbo.Comunidades AS target
    USING (VALUES
(N'Zona 1'),
(N'Zona 2'),
(N'Zona 3'),
(N'Zona 4'),
(N'Zona 5'),
(N'Zona 6'),
(N'Zona 7'),
(N'Zona 8'),
(N'Zona 9'),
(N'Zona 10'),
(N'Zona 11'),
(N'Zona 12'),
(N'Zona 13'),
(N'Zona 14'),
(N'Zona 15'),
(N'Zona 16'),
(N'Zona 17'),
(N'Zona 18'),
(N'Zona 19'),
(N'Zona 21'),
(N'Zona 24'),
(N'Zona 25')
    ) AS source(nombre)
    ON target.nombre = source.nombre
       AND target.municipioId = @MunicipioGuatemalaId
    WHEN MATCHED THEN
        UPDATE SET nombre = source.nombre
    WHEN NOT MATCHED THEN
        INSERT (nombre, municipioId)
        VALUES (source.nombre, @MunicipioGuatemalaId);

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;

PRINT N'';
PRINT N'========== VALIDACIÓN DE CATÁLOGOS ==========';

SELECT COUNT(*) AS Departamentos FROM dbo.Departamentos;
SELECT COUNT(*) AS Municipios FROM dbo.Municipios;

SELECT
    d.codigo,
    d.nombre AS Departamento,
    COUNT(m.id) AS Municipios
FROM dbo.Departamentos d
LEFT JOIN dbo.Municipios m ON m.departamentoId = d.id
GROUP BY d.codigo, d.nombre
ORDER BY d.codigo;

SELECT
    COUNT(*) AS ZonasCapital
FROM dbo.Comunidades c
INNER JOIN dbo.Municipios m ON m.id = c.municipioId
INNER JOIN dbo.Departamentos d ON d.id = m.departamentoId
WHERE d.codigo = N'01'
  AND m.codigo = N'0101'
  AND c.nombre LIKE N'Zona %';

IF (SELECT COUNT(*) FROM dbo.Departamentos) < 22
    THROW 51001, 'Validación falló: faltan departamentos.', 1;

IF (SELECT COUNT(*) FROM dbo.Municipios) < 340
    THROW 51002, 'Validación falló: faltan municipios.', 1;

IF (
    SELECT COUNT(*)
    FROM dbo.Comunidades c
    INNER JOIN dbo.Municipios m ON m.id = c.municipioId
    INNER JOIN dbo.Departamentos d ON d.id = m.departamentoId
    WHERE d.codigo = N'01'
      AND m.codigo = N'0101'
      AND c.nombre LIKE N'Zona %'
) < 22
    THROW 51003, 'Validación falló: faltan zonas de Ciudad de Guatemala.', 1;

PRINT N'OK: catálogo geográfico cargado y validado.';
