-- Enum para tipos de respuesta
CREATE TYPE tipos_respuesta AS ENUM (
    'ABIERTA',
    'OPCION_MULTIPLE_SELECCION_SIMPLE',
    'OPCION_MULTIPLE_SELECCION_MULTIPLE'
);

-- Tabla de encuestas
CREATE TABLE encuestas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    codigo_respuesta VARCHAR NOT NULL,
    codigo_resultados VARCHAR NOT NULL
);

-- Tabla de preguntas
CREATE TABLE preguntas (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    texto VARCHAR NOT NULL,
    tipo tipos_respuesta NOT NULL,
    id_encuesta INT NOT NULL REFERENCES encuestas(id)
);

-- Tabla de opciones para preguntas de opción múltiple
CREATE TABLE opciones (
    id SERIAL PRIMARY KEY,
    texto VARCHAR NOT NULL,
    numero INT NOT NULL,
    id_pregunta INT NOT NULL REFERENCES preguntas(id)
);

-- Tabla de respuestas (registro maestro)
CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    id_encuesta INT NOT NULL REFERENCES encuestas(id)
);

-- Tabla de respuestas abiertas
CREATE TABLE respuestas_abiertas (
    id SERIAL PRIMARY KEY,
    texto VARCHAR NOT NULL,
    id_pregunta INT NOT NULL REFERENCES preguntas(id),
    id_respuesta INT NOT NULL REFERENCES respuestas(id)
);

-- Tabla intermedia para respuestas de opción múltiple
CREATE TABLE respuestas_opciones (
    id SERIAL PRIMARY KEY,
    id_pregunta INT NOT NULL REFERENCES preguntas(id),
    id_respuesta INT NOT NULL REFERENCES respuestas(id),
    id_opcion INT NOT NULL REFERENCES opciones(id)
);