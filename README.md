# Centro de Formación - Aplicaciones Web 26-27

Plataforma web de gestión de un centro de formación. Frontend en HTML, CSS y JavaScript; backend en Node.js con Express y vistas EJS (MariaDB se incorporará en fases posteriores).

## Requisitos

- Node.js 20 o superior (comprobar con `node --version`)
- npm (incluido con Node.js; comprobar con `npm --version`)

## Instalación y arranque

1. Abrir una terminal en la carpeta del proyecto (la que contiene `package.json`).
2. Instalar las dependencias: `npm install`
3. Arrancar la aplicación: `npm start`
4. Abrir http://localhost:3000 en el navegador.

Para desarrollo con reinicio automático al guardar cambios: `npm run dev`.

Para usar otro puerto: `PORT=4000 npm start` (en Windows PowerShell: `$env:PORT=4000; npm start`).

## Estructura

```
centro-formacion/
├── node_modules/        Dependencias instaladas por npm (no se entrega)
├── public/              Recursos estáticos
│   ├── css/             Hojas de estilo
│   ├── images/          Imágenes
│   └── js/              JavaScript del cliente
├── routes/              Rutas de la aplicación
│   └── paginas.js       Rutas de las páginas (GET /, /cursos, ...)
├── views/               Vistas EJS
│   └── partials/        Cabecera y pie compartidos
├── data/                Ficheros JSON de datos (pendiente)
├── app.js               Punto de entrada y configuración
├── package.json         Configuración del proyecto y scripts
└── package-lock.json    Versiones exactas de las dependencias (se genera con npm install)
```

## Rutas

| Ruta | Vista |
| --- | --- |
| `/` | `views/index.ejs` |
| `/cursos` | `views/cursos.ejs` |
| `/docentes` | `views/docentes.ejs` |
| `/aulas` | `views/aulas.ejs` |
| `/matriculas` | `views/matriculas.ejs` |
| `/perfil` | `views/perfil.ejs` |
| `/accesibilidad` | `views/accesibilidad.ejs` |

## Notas

- `node_modules/` no se incluye en las entregas ni en el repositorio; se regenera con `npm install`.
- Conviene conservar `package-lock.json` y usar `npm ci` para instalaciones reproducibles.
- Los datos de matrículas del frontend se guardan de momento en `localStorage`.
