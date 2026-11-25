const filtros = { texto: "", idDocente: "", soloConPlazas: false, orden: "nombre" };
let cursos = [];

const ORDENACIONES = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    fecha: (a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio),
    plazas: (a, b) => b.plazas_libres - a.plazas_libres
};

const listado = document.getElementById("listado-cursos");
const contador = document.getElementById("contador-cursos");
const formulario = document.getElementById("form-filtros");
const selectorDocente = document.getElementById("filtro-docente");

async function pedirCursos() {
    const respuesta = await fetch("/api/cursos", { headers: { Accept: "application/json" } });
    if (!respuesta.ok) {
        throw new Error("El servidor respondió con el estado " + respuesta.status);
    }
    return respuesta.json();
}

function cursosVisibles() {
    const texto = normalizar(filtros.texto.trim());
    return cursos
        .filter(curso => curso.estado === "activo")
        .filter(curso => !texto || normalizar(curso.nombre + " " + (curso.descripcion || "")).includes(texto))
        .filter(curso => !filtros.idDocente || curso.id_docente === Number(filtros.idDocente))
        .filter(curso => !filtros.soloConPlazas || curso.plazas_libres > 0)
        .sort(ORDENACIONES[filtros.orden]);
}

function rutaImagen(ruta) {
    if (!ruta) return null;
    return ruta.startsWith("/") ? ruta : "/" + ruta;
}

function crearImagen(curso) {
    const ruta = rutaImagen(curso.imagen);
    if (!ruta) return null;
    const imagen = el("img", { className: "tarjeta-imagen", src: ruta, alt: "", loading: "lazy" });
    imagen.addEventListener("error", () => imagen.remove());
    return imagen;
}

function crearTarjeta(curso) {
    const libres = curso.plazas_libres;
    const claseInsignia = libres === 0 ? "insignia-error" : libres <= 3 ? "insignia-aviso" : "insignia-ok";
    const textoPlazas = libres === 0 ? "Completo" : libres + (libres === 1 ? " plaza libre" : " plazas libres");

    return el("article", { className: "tarjeta", "aria-labelledby": "curso-" + curso.id_curso },
        crearImagen(curso),
        el("div", { className: "tarjeta-cuerpo" },
            el("h2", { id: "curso-" + curso.id_curso, textContent: curso.nombre }),
            el("p", { className: "tarjeta-descripcion", textContent: curso.descripcion || "Sin descripción" }),
            el("dl", { className: "datos" },
                el("dt", { textContent: "Docente" }), el("dd", { textContent: curso.docente }),
                el("dt", { textContent: "Aula" }), el("dd", { textContent: curso.aula }),
                el("dt", { textContent: "Fechas" }), el("dd", { textContent: formatearFecha(curso.fecha_inicio) + " – " + formatearFecha(curso.fecha_fin) }),
                el("dt", { textContent: "Horario" }), el("dd", { textContent: curso.horario || "Por determinar" })
            ),
            el("p", {}, el("span", { className: "insignia " + claseInsignia, textContent: textoPlazas })),
            el("progress", {
                max: curso.plazas,
                value: curso.matriculados,
                "aria-label": "Plazas ocupadas de " + curso.plazas
            })
        )
    );
}

function pintar() {
    const visibles = cursosVisibles();
    if (visibles.length === 0) {
        listado.replaceChildren(el("p", { className: "vacio", textContent: "No hay cursos que coincidan con los filtros seleccionados." }));
    } else {
        listado.replaceChildren(...visibles.map(crearTarjeta));
    }
    contador.textContent = visibles.length === 1 ? "1 curso encontrado" : visibles.length + " cursos encontrados";
}

function rellenarDocentes() {
    const docentes = new Map();
    cursos.forEach(curso => docentes.set(curso.id_docente, curso.docente));
    const ordenados = [...docentes].sort((a, b) => a[1].localeCompare(b[1], "es"));
    selectorDocente.replaceChildren(
        el("option", { value: "", textContent: "Todos" }),
        ...ordenados.map(([id, nombre]) => el("option", { value: String(id), textContent: nombre }))
    );
}

function pintarError() {
    contador.textContent = "";
    listado.replaceChildren(
        el("div", { className: "vacio", role: "alert" },
            el("p", { textContent: "No se han podido cargar los cursos. Comprueba que el servidor y MariaDB están en marcha." }),
            el("p", {}, el("button", { type: "button", className: "boton boton-primario", "data-accion": "reintentar", textContent: "Reintentar" }))
        )
    );
}

async function cargarCursos() {
    listado.setAttribute("aria-busy", "true");
    listado.replaceChildren(el("p", { className: "vacio", textContent: "Cargando cursos…" }));
    try {
        cursos = await pedirCursos();
        rellenarDocentes();
        pintar();
    } catch (error) {
        console.error("Error al cargar los cursos:", error);
        pintarError();
    } finally {
        listado.setAttribute("aria-busy", "false");
    }
}

function iniciar() {
    formulario.addEventListener("submit", evento => evento.preventDefault());
    document.getElementById("filtro-texto").addEventListener("input", evento => {
        filtros.texto = evento.target.value;
        pintar();
    });
    selectorDocente.addEventListener("change", evento => {
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
        setTimeout(() => { if (cursos.length) pintar(); }, 0);
    });
    listado.addEventListener("click", evento => {
        if (evento.target.closest("button[data-accion='reintentar']")) cargarCursos();
    });

    cargarCursos();
}

document.addEventListener("DOMContentLoaded", iniciar);
