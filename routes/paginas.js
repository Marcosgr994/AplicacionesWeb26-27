import express from "express";

const router = express.Router();

const paginas = [
    { ruta: "/", vista: "index", titulo: "Inicio", pagina: "inicio", scripts: [] },
    { ruta: "/cursos", vista: "cursos", titulo: "Cursos", pagina: "cursos", scripts: ["cursos.js"] },
    { ruta: "/docentes", vista: "docentes", titulo: "Docentes", pagina: "docentes", scripts: ["docentes.js"] },
    { ruta: "/aulas", vista: "aulas", titulo: "Aulas", pagina: "aulas", scripts: ["aulas.js"] },
    { ruta: "/matriculas", vista: "matriculas", titulo: "Mis matrículas", pagina: "matriculas", scripts: ["matriculas.js"] },
    { ruta: "/perfil", vista: "perfil", titulo: "Perfil", pagina: "perfil", scripts: [] },
    { ruta: "/accesibilidad", vista: "accesibilidad", titulo: "Accesibilidad", pagina: "accesibilidad", scripts: [] }
];

for (const { ruta, vista, titulo, pagina, scripts } of paginas) {
    router.get(ruta, (req, res) => {
        res.render(vista, { titulo, pagina, scripts });
    });
}

export default router;
