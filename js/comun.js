const CLAVE_MATRICULAS = "aw_matriculas";
let matriculas = null;

function el(etiqueta, propiedades = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    for (const [clave, valor] of Object.entries(propiedades)) {
        if (clave in nodo) {
            nodo[clave] = valor;
        } else {
            nodo.setAttribute(clave, valor);
        }
    }
    for (const hijo of hijos.flat()) {
        if (hijo === null || hijo === undefined || hijo === false) continue;
        nodo.append(hijo);
    }
    return nodo;
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function formatearFecha(iso) {
    const fecha = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function nombreDocente(id) {
    const docente = DOCENTES.find(d => d.id === id);
    return docente ? docente.nombre + " " + docente.apellidos : "Sin asignar";
}

function nombreAula(id) {
    const aula = AULAS.find(a => a.id === id);
    return aula ? aula.nombre : "Sin asignar";
}

function sembrarMatriculas() {
    const lista = [];
    let id = 1;
    for (const curso of CURSOS) {
        const ocupadas = OCUPACION_INICIAL[curso.id] || 0;
        for (let i = 0; i < ocupadas; i++) {
            lista.push({
                id: id++,
                idUsuario: 100 + i,
                idCurso: curso.id,
                fechaMatricula: "2026-11-02T10:00:00",
                estado: "activa"
            });
        }
    }
    return lista;
}

function obtenerMatriculas() {
    if (matriculas) return matriculas;
    try {
        const guardado = localStorage.getItem(CLAVE_MATRICULAS);
        if (guardado) {
            matriculas = JSON.parse(guardado);
            return matriculas;
        }
    } catch (error) {
        matriculas = null;
    }
    matriculas = sembrarMatriculas();
    guardarMatriculas();
    return matriculas;
}

function guardarMatriculas() {
    try {
        localStorage.setItem(CLAVE_MATRICULAS, JSON.stringify(matriculas));
    } catch (error) {
        return;
    }
}

function restablecerDatos() {
    matriculas = sembrarMatriculas();
    guardarMatriculas();
}

function plazasOcupadas(idCurso) {
    return obtenerMatriculas().filter(m => m.idCurso === idCurso && m.estado === "activa").length;
}

function plazasLibres(curso) {
    return curso.plazas - plazasOcupadas(curso.id);
}

function matriculaActivaDelUsuario(idCurso) {
    return obtenerMatriculas().find(m =>
        m.idUsuario === USUARIO_ACTUAL.id && m.idCurso === idCurso && m.estado === "activa"
    );
}

function matricular(idCurso) {
    const curso = CURSOS.find(c => c.id === idCurso);
    if (!curso) {
        return { ok: false, mensaje: "El curso solicitado no existe." };
    }
    if (curso.estado !== "activo") {
        return { ok: false, mensaje: "El curso «" + curso.nombre + "» no está activo." };
    }
    if (matriculaActivaDelUsuario(idCurso)) {
        return { ok: false, mensaje: "Ya estás matriculado en «" + curso.nombre + "»." };
    }
    if (plazasLibres(curso) <= 0) {
        return { ok: false, mensaje: "No quedan plazas disponibles en «" + curso.nombre + "»." };
    }
    const lista = obtenerMatriculas();
    const nuevoId = lista.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    lista.push({
        id: nuevoId,
        idUsuario: USUARIO_ACTUAL.id,
        idCurso: idCurso,
        fechaMatricula: new Date().toISOString(),
        estado: "activa"
    });
    guardarMatriculas();
    return { ok: true, mensaje: "Te has matriculado correctamente en «" + curso.nombre + "»." };
}

function cancelarMatricula(idMatricula) {
    const matricula = obtenerMatriculas().find(m => m.id === idMatricula && m.idUsuario === USUARIO_ACTUAL.id);
    if (!matricula) {
        return { ok: false, mensaje: "No se ha encontrado la matrícula." };
    }
    if (matricula.estado !== "activa") {
        return { ok: false, mensaje: "Esa matrícula ya estaba cancelada." };
    }
    matricula.estado = "cancelada";
    matricula.fechaCancelacion = new Date().toISOString();
    guardarMatriculas();
    const curso = CURSOS.find(c => c.id === matricula.idCurso);
    return { ok: true, mensaje: "Has cancelado tu matrícula en «" + curso.nombre + "». Queda registrada en tu histórico." };
}

function mostrarAviso(tipo, texto) {
    let zona = document.getElementById("avisos");
    if (!zona) {
        zona = el("div", { id: "avisos", className: "avisos", role: "status", "aria-live": "polite" });
        document.querySelector("main").prepend(zona);
    }
    const aviso = el("div", { className: "aviso aviso-" + tipo },
        el("span", { textContent: texto }),
        el("button", { type: "button", className: "aviso-cerrar", "aria-label": "Cerrar aviso", textContent: "×" })
    );
    aviso.querySelector("button").addEventListener("click", () => aviso.remove());
    zona.replaceChildren(aviso);
    setTimeout(() => aviso.remove(), 7000);
}

function confirmar(titulo, mensaje, textoAceptar) {
    return new Promise(resolve => {
        const dialogo = el("dialog", { className: "modal", "aria-labelledby": "modal-titulo" },
            el("form", { method: "dialog" },
                el("h2", { id: "modal-titulo", textContent: titulo }),
                el("p", { textContent: mensaje }),
                el("div", { className: "modal-acciones" },
                    el("button", { type: "submit", value: "cancelar", className: "boton boton-secundario", textContent: "Cancelar" }),
                    el("button", { type: "submit", value: "ok", className: "boton boton-primario", textContent: textoAceptar || "Aceptar" })
                )
            )
        );
        dialogo.addEventListener("close", () => {
            const aceptado = dialogo.returnValue === "ok";
            dialogo.remove();
            resolve(aceptado);
        });
        document.body.append(dialogo);
        dialogo.showModal();
    });
}

function crearTabla(titulo, columnas, filas) {
    const cabecera = el("tr", {}, columnas.map(c => el("th", { scope: "col", textContent: c })));
    const cuerpo = filas.map(fila => el("tr", {}, fila.map((celda, i) =>
        el("td", { "data-etiqueta": columnas[i] }, celda)
    )));
    return el("div", { className: "tabla-responsive" },
        el("table", { className: "tabla" },
            el("caption", { className: "sr-only", textContent: titulo }),
            el("thead", {}, cabecera),
            el("tbody", {}, cuerpo)
        )
    );
}

function marcarEnlaceActivo() {
    const actual = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".menu-principal a").forEach(enlace => {
        if (enlace.getAttribute("href") === actual) {
            enlace.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", marcarEnlaceActivo);
