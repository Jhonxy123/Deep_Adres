const db     = require('../config/db');


async function encontrarIndemnizaciones(userId) {
    try {
        const { rows } = await db.query(
            `SELECT no_radicado, fecha_radicacion 
             FROM indemnizacion 
             WHERE id_usuario = $1 
             ORDER BY fecha_radicacion DESC`,
            [userId]
        );
        return rows;
    } catch (error) {
        console.error('Error al buscar indemnizaciones:', error);
        throw error; // O manejar el error como prefieras
    }
}


async function encontrarForm(userId) {
    try {
        const { rows } = await db.query(
            `select form_ingresado from indemnizacion where id_usuario = $1`,
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error al buscar indemnizaciones:', error);
        throw error; // O manejar el error como prefieras
    }
}

module.exports = { encontrarIndemnizaciones, encontrarForm};


