import pool from "../config/db.js";

const SQL_CURSOS = `
    SELECT c.id_curso, c.id_docente, c.id_aula, c.nombre, c.descripcion,
           CAST(c.fecha_inicio AS CHAR) AS fecha_inicio,
           CAST(c.fecha_fin AS CHAR) AS fecha_fin,
           c.horario, c.plazas, c.imagen, c.estado,
           d.nombre AS docente,
           a.nombre AS aula,
           (SELECT COUNT(*) FROM matriculas m
             WHERE m.id_curso = c.id_curso AND m.estado = 'activa') AS matriculados
    FROM cursos c
    INNER JOIN docentes d ON d.id_docente = c.id_docente
    INNER JOIN aulas a ON a.id_aula = c.id_aula
    ORDER BY c.nombre`;

export async function obtenerCursos() {
    const filas = await pool.query(SQL_CURSOS);
    return filas.map(fila => {
        const plazas = Number(fila.plazas);
        const matriculados = Number(fila.matriculados);
        return {
            ...fila,
            plazas,
            matriculados,
            plazas_libres: Math.max(plazas - matriculados, 0)
        };
    });
}
