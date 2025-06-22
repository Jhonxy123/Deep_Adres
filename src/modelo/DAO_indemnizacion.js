const db = require('../config/db');


async function encontrarIndemnizaciones(userId) {
    try {
        const { rows } = await db.query(
            `SELECT no_radicado, fecha_radicacion, form_verificado 
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

async function limpiarCamposIndemnizacion(no_radicado) {
  const result = await db.query(
    `UPDATE Indemnizacion SET 
      form_verificado = NULL,
      valor_indemnizacion = NULL,
      fecha_verificacion = NULL,
      descripcion = NULL,
      auditor = NULL,
      calificacion_reporteIA = NULL
     WHERE no_radicado = $1
     RETURNING *`,
    [no_radicado]
  );

  return result.rows[0]; // Devuelve el registro actualizado con los campos "eliminados"
}



async function guardarIndemnizacionVerificada(
  no_radicado,
  formularioVerificado,
  valorIndem,
  fechaVerificacion,
  descripcion,
  auditor,
  calificacion
) {
  const result = await db.query(
    `UPDATE Indemnizacion SET 
      form_verificado = $1,
      valor_indemnizacion = $2,
      fecha_verificacion = $3,
      descripcion = $4,
      auditor = $5,
      calificacion_reporteia = $6
     WHERE no_radicado = $7
     RETURNING *`, // Añadido RETURNING para obtener el registro actualizado
    [
      formularioVerificado,
      valorIndem,
      fechaVerificacion,
      descripcion,
      auditor,
      calificacion,
      no_radicado
    ]
  );

  return result.rows[0];
}

async function encontrarIndemnizacionesSinVerificar() {
    try {
        const { rows } = await db.query(
            `SELECT no_radicado, fecha_radicacion
             FROM indemnizacion
             WHERE form_verificado IS NULL 
             ORDER BY fecha_radicacion DESC`
        );
        return rows;
    } catch (error) {
        console.error('Error al buscar indemnizaciones:', error);
        throw error; // O manejar el error como prefieras
    }
}

async function encontrarIndemnizacionesVerificadas() {
    try {
        const { rows } = await db.query(
            `SELECT no_radicado, fecha_radicacion 
             FROM indemnizacion
             WHERE form_verificado IS NOT NULL 
             ORDER BY fecha_radicacion DESC`
        );
        return rows;
    } catch (error) {
        console.error('Error al buscar indemnizaciones:', error);
        throw error; // O manejar el error como prefieras
    }
}

async function buscarPorNoRadicado(idFormulario) {

    try {
        const { rows } = await db.query(
            `SELECT *
             FROM indemnizacion
             WHERE no_radicado = $1`,
             [idFormulario]
        );
        return rows[0] || null;
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




async function traerDepartamentos() {
    
    try{
        const { rows } = await db.query(
            `select id, departamento from departamento`
        );
        return rows[1] || null;
    }catch(error){
        console.error('Error al buscar departamentos: ', error)
        throw error;
    }

}

async function obtenerEstadisticasCalificaciones() {
    try {
        const { rows } = await db.query(`
            SELECT 
                calificacion_reporteIA as calificacion,
                COUNT(*) as cantidad
            FROM indemnizacion
            WHERE calificacion_reporteIA IS NOT NULL
            GROUP BY calificacion_reporteIA
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener estadísticas de calificaciones:', error);
        throw error;
    }
}


module.exports = { encontrarIndemnizaciones,limpiarCamposIndemnizacion, encontrarForm,traerDepartamentos,encontrarIndemnizacionesSinVerificar,buscarPorNoRadicado,guardarIndemnizacionVerificada,encontrarIndemnizacionesVerificadas, obtenerEstadisticasCalificaciones};


