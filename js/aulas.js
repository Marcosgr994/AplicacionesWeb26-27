function cursosActivosDeAula(idAula) {
    return CURSOS.filter(c => c.idAula === idAula && c.estado === "activo");
}

function iniciar() {
    const filas = AULAS.map(aula => {
        const activa = aula.estado === "activa";
        return [
            aula.nombre,
            aula.edificio + ", " + aula.planta,
            String(aula.capacidad),
            aula.equipamiento,
            el("span", { className: "insignia " + (activa ? "insignia-ok" : "insignia-error"), textContent: activa ? "Activa" : "Inactiva" }),
            String(cursosActivosDeAula(aula.id).length)
        ];
    });
    document.getElementById("zona-aulas").replaceChildren(
        crearTabla("Listado de aulas", ["Aula", "Ubicación", "Capacidad", "Equipamiento", "Estado", "Cursos activos"], filas)
    );
}

document.addEventListener("DOMContentLoaded", iniciar);
