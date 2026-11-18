const USUARIO_ACTUAL = {
    id: 1,
    nombre: "Alumno",
    apellidos: "Demo",
    email: "alumno@centroformacion.es",
    rol: "alumno"
};

const DOCENTES = [
    { id: 1, nombre: "Laura", apellidos: "Martínez Ruiz", especialidad: "Desarrollo web", email: "laura.martinez@centroformacion.es", telefono: "600 111 222", estado: true },
    { id: 2, nombre: "Javier", apellidos: "Soto Prieto", especialidad: "Programación", email: "javier.soto@centroformacion.es", telefono: "600 222 333", estado: true },
    { id: 3, nombre: "Carlos", apellidos: "Pérez Gil", especialidad: "Ofimática", email: "carlos.perez@centroformacion.es", telefono: "600 333 444", estado: true },
    { id: 4, nombre: "Ana", apellidos: "Torres León", especialidad: "Idiomas", email: "ana.torres@centroformacion.es", telefono: "600 444 555", estado: true },
    { id: 5, nombre: "Marta", apellidos: "Vidal Cano", especialidad: "Diseño gráfico", email: "marta.vidal@centroformacion.es", telefono: "600 555 666", estado: true }
];

const AULAS = [
    { id: 1, nombre: "Aula 1.01", edificio: "Edificio A", planta: "Planta 1", capacidad: 30, equipamiento: "Proyector y pizarra", estado: "activa" },
    { id: 2, nombre: "Laboratorio 1", edificio: "Edificio A", planta: "Planta 2", capacidad: 25, equipamiento: "25 ordenadores y proyector", estado: "activa" },
    { id: 3, nombre: "Aula 2.03", edificio: "Edificio B", planta: "Planta 2", capacidad: 20, equipamiento: "Pizarra digital", estado: "activa" },
    { id: 4, nombre: "Taller de diseño", edificio: "Edificio B", planta: "Planta 1", capacidad: 15, equipamiento: "Mesas de dibujo y tabletas gráficas", estado: "activa" },
    { id: 5, nombre: "Aula 0.02", edificio: "Edificio C", planta: "Planta baja", capacidad: 40, equipamiento: "Proyector y sistema de sonido", estado: "inactiva" }
];

const CURSOS = [
    { id: 1, nombre: "Desarrollo web con HTML y CSS", descripcion: "Maquetación de páginas adaptables con HTML5 y CSS3, formularios y buenas prácticas de accesibilidad.", idDocente: 1, idAula: 2, fechaInicio: "2027-01-18", fechaFin: "2027-03-12", horario: "Lunes y miércoles, 18:00-20:00", plazas: 20, estado: "activo" },
    { id: 2, nombre: "Introducción a Python", descripcion: "Primeros pasos en programación: variables, control de flujo, funciones y estructuras de datos.", idDocente: 2, idAula: 2, fechaInicio: "2027-01-19", fechaFin: "2027-03-16", horario: "Martes y jueves, 18:00-20:00", plazas: 25, estado: "activo" },
    { id: 3, nombre: "Excel avanzado", descripcion: "Tablas dinámicas, fórmulas avanzadas, validación de datos y automatización básica.", idDocente: 3, idAula: 1, fechaInicio: "2027-02-01", fechaFin: "2027-03-26", horario: "Lunes y viernes, 16:00-18:00", plazas: 12, estado: "activo" },
    { id: 4, nombre: "Inglés B1", descripcion: "Preparación del nivel intermedio con práctica de comprensión, expresión oral y escrita.", idDocente: 4, idAula: 3, fechaInicio: "2027-01-25", fechaFin: "2027-05-28", horario: "Lunes, miércoles y viernes, 10:00-11:30", plazas: 18, estado: "activo" },
    { id: 5, nombre: "Diseño gráfico con herramientas libres", descripcion: "Fundamentos de composición, color y tipografía con software libre.", idDocente: 5, idAula: 4, fechaInicio: "2027-02-09", fechaFin: "2027-04-22", horario: "Martes y jueves, 17:00-19:00", plazas: 12, estado: "activo" },
    { id: 6, nombre: "JavaScript desde cero", descripcion: "Manipulación del DOM, eventos, estructuras de datos y uso de Fetch con JSON.", idDocente: 1, idAula: 2, fechaInicio: "2027-03-15", fechaFin: "2027-05-14", horario: "Lunes y miércoles, 18:00-20:00", plazas: 20, estado: "activo" },
    { id: 7, nombre: "Bases de datos con SQL", descripcion: "Modelo relacional, consultas SELECT, JOIN y diseño de esquemas con MariaDB.", idDocente: 2, idAula: 1, fechaInicio: "2027-03-16", fechaFin: "2027-05-18", horario: "Martes y jueves, 16:00-18:00", plazas: 15, estado: "activo" },
    { id: 8, nombre: "Ofimática básica", descripcion: "Procesador de textos, hoja de cálculo y presentaciones. Edición ya finalizada.", idDocente: 3, idAula: 1, fechaInicio: "2026-09-14", fechaFin: "2026-10-30", horario: "Lunes y miércoles, 10:00-12:00", plazas: 20, estado: "inactivo" }
];

const OCUPACION_INICIAL = { 1: 17, 2: 10, 3: 12, 4: 9, 5: 11, 6: 4, 7: 14, 8: 20 };
