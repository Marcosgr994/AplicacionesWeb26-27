import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

export async function comprobarConexion() {
    let conexion;
    try {
        conexion = await pool.getConnection();
        console.log("Conexión con MariaDB establecida");
    } catch (error) {
        console.error("No se pudo conectar con MariaDB:", error.message);
    } finally {
        if (conexion) conexion.release();
    }
}

export default pool;
