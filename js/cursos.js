const filtros = { texto: "", idDocente: "", soloConPlazas: false, orden: "nombre" };

const ORDENACIONES = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    fecha: (a, b) => a.fechaInicio.localeCompare(b.fechaInicio),
    plazas: (a, b) => plazasLibres(b) - plazasLibres(a)
};

const listado = document.getElementById("listado-cursos");
const contador = document.getElementById("contador-cursos");
const formulario = document.getElementById("form-filtros");

function cursosVisibles() {
    const texto = normalizar(filtros.texto.trim());
    return CURSOS
        .filter(curso => curso.estado === "activo")
        .filter(curso => !texto || normalizar(curso.nombre + " " + curso.descripcion).includes(texto))
        .filter(curso => !filtros.idDocente || curso.idDocente === Number(filtros.idDocente))
        .filter(curso => !filtros.soloConPlazas || plazasLibres(curso) > 0)
        .sort(ORDENACIONES[filtros.orden]);
}

function crearBotonMatricula(curso) {
    if (matriculaActivaDelUsuario(curso.id)) {
        return el("button", { type: "button", className: "boton boton-secundario", disabled: true, textContent: "Ya estás matriculado" });
    }
    if (plazasLibres(curso) <= 0) {
        return el("button", { type: "button", className: "boton boton-secundario", disabled: true, textContent: "Curso completo" });
    }
    return el("button", {
        type: "button",
        className: "boton boton-primario",
        "data-accion": "matricular",
        "data-id": String(curso.id),
        textContent: "Matricularme"
    });
}

function crearTarjeta(curso) {
    const libres = plazasLibres(curso);
    const ocupadas = curso.plazas - libres;
    const claseInsignia = libres === 0 ? "insignia-error" : libres <= 3 ? "insignia-aviso" : "insignia-ok";
    const textoPlazas = libres === 0 ? "Completo" : libres + (libres === 1 ? " plaza libre" : " plazas libres");

    return el("article", { className: "tarjeta", "aria-labelledby": "curso-" + curso.id },
        el("div", { className: "tarjeta-cuerpo" },
            el("h2", { id: "curso-" + curso.id, textContent: curso.nombre }),
            el("p", { className: "tarjeta-descripcion", textContent: curso.descripcion }),
            el("dl", { className: "datos" },
                el("dt", { textContent: "Docente" }), el("dd", { textContent: nombreDocente(curso.idDocente) }),
                el("dt", { textContent: "Aula" }), el("dd", { textContent: nombreAula(curso.idAula) }),
                el("dt", { textContent: "Fechas" }), el("dd", { textContent: formatearFecha(curso.fechaInicio) + " – " + formatearFecha(curso.fechaFin) }),
                el("dt", { textContent: "Horario" }), el("dd", { textContent: curso.horario })
            ),
            el("p", {}, el("span", { className: "insignia " + claseInsignia, textContent: textoPlazas })),
            el("progress", {
                max: curso.plazas,
                value: ocupadas,
                "aria-label": "Plazas ocupadas de " + curso.plazas
            })
        ),
        el("div", { className: "tarjeta-pie" }, crearBotonMatricula(curso))
    );
}

function pintar() {
    const cursos = cursosVisibles();
    if (cursos.length === 0) {
        listado.replaceChildren(el("p", { className: "vacio", textContent: "No hay cursos que coincidan con los filtros seleccionados." }));
    } else {
        listado.replaceChildren(...cursos.map(crearTarjeta));
    }
    contador.textContent = cursos.length === 1 ? "1 curso encontrado" : cursos.length + " cursos encontrados";
}

async function alPulsarMatricular(idCurso) {
    const curso = CURSOS.find(c => c.id === idCurso);
    const aceptado = await confirmar(
        "Confirmar matrícula",
        "¿Quieres matricularte en «" + curso.nombre + "»?",
        "Matricularme"
    );
    if (!aceptado) return;
    const resultado = matricular(idCurso);
    mostrarAviso(resultado.ok ? "exito" : "error", resultado.mensaje);
    pintar();
}

function cargarDocentesEnFiltro() {
    const selector = document.getElementById("filtro-docente");
    DOCENTES.forEach(docente => {
        selector.append(el("option", { value: String(docente.id), textContent: docente.nombre + " " + docente.apellidos }));
    });
}

function iniciar() {
    cargarDocentesEnFiltro();

    formulario.addEventListener("submit", evento => evento.preventDefault());
    document.getElementById("filtro-texto").addEventListener("input", evento => {
        filtros.texto = evento.target.value;
        pintar();
    });
    document.getElementById("filtro-docente").addEventListener("change", evento => {
        filtros.idDocente = evento.target.value;
        pintar();
    });
    document.getElementById("filtro-plazas").addEventListener("change", evento => {
        filtros.soloConPlazas = evento.target.checked;
        pintar();
    });
    document.getElementById("filtro-orden").addEventListener("change", evento => {
        filtros.orden = evento.target.value;
        pintar();
    });
    formulario.addEventListener("reset", () => {
        filtros.texto = "";
        filtros.idDocente = "";
        filtros.soloConPlazas = false;
        filtros.orden = "nombre";
        setTimeout(pintar, 0);
    });
    listado.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion='matricular']");
        if (boton) alPulsarMatricular(Number(boton.dataset.id));
    });

    pintar();
}

document.addEventListener("DOMContentLoaded", iniciar);
