let vista = "activas";

const zonaTabla = document.getElementById("zona-tabla");
const botonesVista = document.querySelectorAll("[data-vista]");

function matriculasDelUsuario(estado) {
    return obtenerMatriculas()
        .filter(m => m.idUsuario === USUARIO_ACTUAL.id && m.estado === estado)
        .sort((a, b) => b.fechaMatricula.localeCompare(a.fechaMatricula));
}

function crearFila(matricula) {
    const curso = CURSOS.find(c => c.id === matricula.idCurso);
    const esActiva = matricula.estado === "activa";
    const estado = el("span", {
        className: "insignia " + (esActiva ? "insignia-ok" : "insignia-error"),
        textContent: esActiva ? "Activa" : "Cancelada"
    });
    const accion = esActiva
        ? el("button", {
            type: "button",
            className: "boton boton-peligro",
            "data-accion": "cancelar",
            "data-id": String(matricula.id),
            textContent: "Cancelar matrícula"
        })
        : el("span", { textContent: matricula.fechaCancelacion ? "Cancelada el " + formatearFecha(matricula.fechaCancelacion) : "—" });

    return [
        el("a", { href: "/cursos", textContent: curso.nombre }),
        nombreDocente(curso.idDocente),
        nombreAula(curso.idAula),
        formatearFecha(curso.fechaInicio) + " – " + formatearFecha(curso.fechaFin),
        formatearFecha(matricula.fechaMatricula),
        estado,
        accion
    ];
}

function pintar() {
    const activas = matriculasDelUsuario("activa");
    const canceladas = matriculasDelUsuario("cancelada");

    document.getElementById("cuenta-activas").textContent = activas.length;
    document.getElementById("cuenta-historico").textContent = canceladas.length;
    botonesVista.forEach(boton => boton.setAttribute("aria-pressed", String(boton.dataset.vista === vista)));

    const lista = vista === "activas" ? activas : canceladas;
    if (lista.length === 0) {
        const mensaje = vista === "activas"
            ? "No tienes matrículas activas. Consulta el catálogo para matricularte."
            : "Todavía no has cancelado ninguna matrícula.";
        zonaTabla.replaceChildren(
            el("p", { className: "vacio" }, mensaje + " ", vista === "activas" ? el("a", { href: "/cursos", textContent: "Ver cursos" }) : null)
        );
        return;
    }
    const titulo = vista === "activas" ? "Matrículas activas" : "Histórico de matrículas canceladas";
    zonaTabla.replaceChildren(crearTabla(
        titulo,
        ["Curso", "Docente", "Aula", "Periodo", "Matriculado el", "Estado", "Acciones"],
        lista.map(crearFila)
    ));
}

async function alPulsarCancelar(idMatricula) {
    const matricula = obtenerMatriculas().find(m => m.id === idMatricula);
    const curso = CURSOS.find(c => c.id === matricula.idCurso);
    const aceptado = await confirmar(
        "Cancelar matrícula",
        "¿Seguro que quieres cancelar tu matrícula en «" + curso.nombre + "»? Quedará guardada en tu histórico y la plaza volverá a estar disponible.",
        "Sí, cancelar"
    );
    if (!aceptado) return;
    const resultado = cancelarMatricula(idMatricula);
    mostrarAviso(resultado.ok ? "exito" : "error", resultado.mensaje);
    pintar();
}

function iniciar() {
    botonesVista.forEach(boton => {
        boton.addEventListener("click", () => {
            vista = boton.dataset.vista;
            pintar();
        });
    });
    zonaTabla.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion='cancelar']");
        if (boton) alPulsarCancelar(Number(boton.dataset.id));
    });
    pintar();
}

document.addEventListener("DOMContentLoaded", iniciar);
