CREATE DATABASE Indemnizaciones;
\c indemnizaciones;

CREATE TABLE Tipo_Usuario
(
    ID int,
    Tipo_usuario VARCHAR(20),
    PRIMARY KEY(ID)
);

CREATE TABLE Departamento
(
    ID int,
    Departamento VARCHAR(50),
    PRIMARY KEY(ID)
);

CREATE TABLE Conc_reclamado
(
    ID int,
    Conc_reclamado VARCHAR(50),
    PRIMARY KEY(ID)
);

CREATE TABLE Usuario
(
    ID VARCHAR(15),
    Nombre VARCHAR(100),
    Cedula VARCHAR(12),
    Correo VARCHAR (300),
    ID_Tipo_usuario int,
    Contrasena VARCHAR(400),
    PRIMARY KEY(ID)
);

CREATE TABLE Indemnizacion
(
    No_radicado VARCHAR(20),
    Fecha_radicacion DATE,
    ID_Departamento int,
    ID_Conc_reclamado int,
    ID_Usuario VARCHAR(15),
    Form_ingresado JSONB NOT NULL,
    Form_generado TEXT,
    Form_verificado TEXT,
    Valor_indemnizacion float,
    Fecha_verificacion DATE,
    Descripcion TEXT,
    Auditor VARCHAR(50),
    Calificacion_reporteIA VARCHAR(30),
    PRIMARY KEY(No_radicado)
);

 ALTER TABLE Usuario
    ADD CONSTRAINT FK_Tipo_Usuario
        FOREIGN KEY (ID_Tipo_usuario) 
            REFERENCES Tipo_Usuario(ID)
            MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE Indemnizacion
    ADD CONSTRAINT FK_ID_Departamento
        FOREIGN KEY (ID_Departamento) 
            REFERENCES Departamento(ID)
            MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE Indemnizacion
    ADD CONSTRAINT FK_ID_Conc_reclamado
        FOREIGN KEY (ID_Conc_reclamado) 
            REFERENCES Conc_reclamado(ID)
            MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE Indemnizacion
    ADD CONSTRAINT FK_ID_Usuario
        FOREIGN KEY (ID_Usuario) 
            REFERENCES Usuario(ID)
            MATCH FULL ON UPDATE CASCADE ON DELETE SET NULL;


INSERT INTO Tipo_Usuario (ID, Tipo_usuario) VALUES
(1, 'Administrador'),
(2, 'Usuario');

CREATE OR REPLACE FUNCTION generar_id_personalizado(
    tipo_usuario INT,
    nombre_completo TEXT,
    cedula TEXT
)
RETURNS VARCHAR AS $$
DECLARE
    primer_nombre TEXT;
    inicial_apellido TEXT;
    ultimos_5_cedula TEXT;
BEGIN
    -- Extraer primer nombre y primera letra del segundo
    primer_nombre := split_part(nombre_completo, ' ', 1);
    inicial_apellido := SUBSTRING(split_part(nombre_completo, ' ', 2) FROM 1 FOR 1);

    -- Si no hay segundo nombre/apellido, usar solo primer nombre
    IF inicial_apellido IS NULL OR inicial_apellido = '' THEN
        inicial_apellido := '';
    END IF;

    -- Tomar los últimos 5 caracteres de la cédula
    ultimos_5_cedula := RIGHT(cedula, 5);

    RETURN tipo_usuario::TEXT || primer_nombre || inicial_apellido || ultimos_5_cedula;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION before_insert_usuario()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ID IS NULL THEN
        NEW.ID := generar_id_personalizado(
            NEW.ID_Tipo_usuario,
            NEW.Nombre,
            NEW.Cedula
        );
    END IF;

    -- Asignar también el mismo valor como contraseña si está vacía o NULL
    IF NEW.Contrasena IS NULL OR NEW.Contrasena = '' THEN
        NEW.Contrasena := NEW.ID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_before_insert_usuario
BEFORE INSERT ON Usuario
FOR EACH ROW
EXECUTE FUNCTION before_insert_usuario();


-- Insertar en Usuario
INSERT INTO Usuario (Nombre, Cedula, Correo, ID_Tipo_usuario) VALUES
('Carlos Mendoza', '1234567890', 'carlos.mendoza@example.com', 1),
('Ana Torres', '9876543210', 'ana.torres@example.com', 1),
('Luis Pérez', '1112223334', 'luis.perez@example.com', 2),
('María Gómez', '4445556667', 'maria.gomez@example.com', 2),
('Sofía López', '7778889991', 'sofia.lopez@example.com', 2);

UPDATE usuario
SET contrasena = '$2b$10$FGU5skrQRkal9h6YIho41.hsdFpQCK4yVx6wcODvhfhE44UKcFjEu'
WHERE correo = 'carlos.mendoza@example.com';

--Insert Departamento
INSERT INTO departamento (id, departamento) VALUES
(1, 'Amazonas'),
(2, 'Antioquia'),
(3, 'Arauca'),
(4, 'Atlántico'),
(5, 'Bolívar'),
(6, 'Boyacá'),
(7, 'Caldas'),
(8, 'Caquetá'),
(9, 'Casanare'),
(10, 'Cauca'),
(11, 'Cesar'),
(12, 'Chocó'),
(13, 'Córdoba'),
(14, 'Cundinamarca'),
(15, 'Guainía'),
(16, 'Guaviare'),
(17, 'Huila'),
(18, 'La Guajira'),
(19, 'Magdalena'),
(20, 'Meta'),
(21, 'Nariño'),
(22, 'Norte de Santander'),
(23, 'Putumayo'),
(24, 'Quindío'),
(25, 'Risaralda'),
(26, 'San Andrés y Providencia'),
(27, 'Santander'),
(28, 'Sucre'),
(29, 'Tolima'),
(30, 'Valle del Cauca'),
(31, 'Vaupés'),
(32, 'Vichada'),
(33, 'Bogotá D.C.');

-- Insertar en conc_reclamado

INSERT INTO  conc_reclamado (id,conc_reclamado) VALUES
(1,'indemnización por muerte y gastos funerarios'),
(2,'incapacidad permanente');
