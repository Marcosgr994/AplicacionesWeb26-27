function cursosActivosDeDocente(idDocente) {
    return CURSOS.filter(c => c.idDocente === idDocente && c.estado === "activo");
}

function iniciar() {
    const filas = DOCENTES.map(docente => [
        docente.nombre + " " + docente.apellidos,
        docente.especialidad,
        el("a", { href: "mailto:" + docente.email, textContent: docente.email }),
        docente.telefono,
        cursosActivosDeDocente(docente.id).map(c => c.nombre).join(", ") || "Sin cursos activos"
    ]);
    document.getElementById("zona-docentes").replaceChildren(
        crearTabla("Listado de docentes", ["Nombre", "Especialidad", "Correo", "Teléfono", "Cursos activos"], filas)
    );
}

document.addEventListener("DOMContentLoaded", iniciar);
