import path from "path";
import usuarioDAO from "../modelo/DAO_Usuario.js";
import indemnizacionDAO from "../modelo/DAO_indemnizacion.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { enviarEmail } from "../../services/mail.services.js";
import { generarFormGemini } from "../../services/ia.service.js";
import PDFDocument from "pdfkit";

import { Console } from "console";

// Configuración de variables de entorno y __dirname
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Controladores
export const paginaIndex = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "vistas", "index.html"));
};

export const paginaRegistro = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "vistas", "registro.html"));
};

export const paginaFormulario = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "vistas", "formulario.html"));
};

export const historal_usuario = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "vistas", "historial.ejs"));
};

export const formulario_guardado = async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "vistas", "formulario_guardado.html")
  );
};

export const mostrarVistaPreviaPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const indemnizacion = await indemnizacionDAO.buscarPorNoRadicado(id);

    if (!indemnizacion) {
      return res.status(404).render("error", {
        mensaje: "Registro no encontrado",
      });
    }

    let estado, titulo, claseTitulo;

    if (indemnizacion.valor_indemnizacion !== null) {
      if (indemnizacion.valor_indemnizacion === 0) {
        estado = "RECHAZADO";
        titulo = "RECHAZADO";
        claseTitulo = "titulo-rechazado";
      } else {
        estado = "APROBADO";
        titulo = "APROBADO";
        claseTitulo = "titulo-aprobado";
      }
    } else {
      estado = "PENDIENTE";
      titulo = "Vista Previa del Reporte";
      claseTitulo = "titulo-pendiente";
    }

    // Generar PDF como base64 (sin cambiar el resto de tu lógica)
    const pdfBuffer = await new Promise((resolve) => {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Contenido del PDF (manteniendo tu formato actual)
      doc
        .fontSize(20)
        .text("Reporte de Indemnización", { align: "center" })
        .moveDown();

      doc
        .fontSize(12)
        .text(`Radicado: ${indemnizacion.no_radicado}`)
        .text(`Valor: $${indemnizacion.valor_indemnizacion}`)
        .text(
          `Fecha: ${new Date(
            indemnizacion.fecha_verificacion
          ).toLocaleDateString()}`
        )
        .moveDown();

      if (indemnizacion.descripcion) {
        doc
          .fontSize(14)
          .text("Descripción:", { underline: true })
          .fontSize(12)
          .text(indemnizacion.descripcion)
          .moveDown()
          .text(
            "Como análisis de la solicitud recibida, se ha realizado una evaluación detallada conforme a los criterios establecidos para este tipo de trámite:"
          )
          .moveDown()
          .fontSize(12)
          .text(indemnizacion.form_verificado);
      }

      doc.end();
    });

    const pdfBase64 = pdfBuffer.toString("base64");

    // Renderizar con los datos correctos
    res.render("resultado", {
      titulo: "Vista Previa del Reporte",
      claseTitulo: claseTitulo,
      estado: estado,
      pdfData: pdfBase64, // PDF en base64 para incrustar
      pdfUrl: `/historialusuario/descargar-pdf/${id}`, // Ruta para descarga
      indemnizacion: indemnizacion, // Pasamos los datos por si los necesitas
    });
  } catch (error) {
    console.error("Error al generar vista previa:", error);
    res.status(500).render("error", {
      mensaje: "Error al cargar la vista previa",
    });
  }
};

export const guardarFormulario = async (req, res) => {
  try {
    const jsonData = req.body;
    const userId = req.session.user.id;

    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).send("Datos requeridos");
    }

    // Agrega el ID del usuario si está autenticado
    const datosParaGuardar = {
      ...jsonData,
      userId: req.user?.id,
    };

    //Generar respuesta de Gemini
    const generarForm = await generarFormGemini(datosParaGuardar);
    //guardar el formulario junto a la repsuesta de gemini
    const resultado = await usuarioDAO.guardarFormularioDB(
      generarForm,
      datosParaGuardar,
      userId
    );

    console.log("Formulario guardado con radicado:", resultado.no_radicado);

    res.redirect("/paginaMenuUser");
  } catch (error) {
    console.error("Error al guardar formulario:", error);
    res.status(500).send("Error interno");
  }
};

export const guardarIndemnizacionVerificada = async (req, res) => {
  try {
    // Corregido: req.body en lugar de req.bod
    const {
      noRadicado,
      valor_indemnizacion,
      calificacion,
      observaciones,
      verificacion,
      informe,
    } = req.body;
    const userId = req.session.user.id;
    const fechaVerificacion = new Date();

    const guardarVerificacion =
      await indemnizacionDAO.guardarIndemnizacionVerificada(
        noRadicado,
        informe,
        valor_indemnizacion,
        fechaVerificacion,
        observaciones,
        userId,
        calificacion
      );

    console.log("Verificación guardada");
    res.status(200).json({ success: true, data: guardarVerificacion });
  } catch (error) {
    console.error("Error al guardar verificación:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: error.message });
  }
};

export const traerHistorial = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const resultado = await indemnizacionDAO.encontrarIndemnizaciones(userId);

    res.render("historial_indem", { resultado });
  } catch (error) {
    console.error("Error al traer la información: ".error);
    res.status(500).send("Error interno");
  }
};

export const indem_por_ver = async (req, res) => {
  try {
    const resultado =
      await indemnizacionDAO.encontrarIndemnizacionesSinVerificar();

    res.render("historial_sinverificar", { resultado });
  } catch (error) {
    console.error("Error al traer la información: ".error);
    res.status(500).send("Error interno");
  }
};

export const eliminarIndemnizacion = async (req, res) => {
  try {
    const { radicado } = req.params;
    const userId = req.session.user.id; // Asumiendo que usas sesiones

    // Validación básica
    if (!radicado) {
      return res.status(400).json({
        error: "Número de radicado requerido",
      });
    }

    // Llamar al DAO para limpiar los campos
    const resultado = await indemnizacionDAO.limpiarCamposIndemnizacion(
      radicado
    );

    if (!resultado) {
      return res.status(404).json({
        error: "No se encontró el reporte con el radicado proporcionado",
      });
    }

    console.log(`Usuario ${userId} eliminó datos de indemnización ${radicado}`);

    return res.status(200).json({
      success: true,
      message: "Reporte eliminado correctamente",
    });
  } catch (error) {
    console.error("Error en eliminarIndemnizacion:", error);

    // Enviar mensaje de error detallado en desarrollo
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error.message
        : "Error interno al procesar la solicitud";

    res.status(500).json({
      error: errorMessage,
    });
  }
};

export const indem_verificada = async (req, res) => {
  try {
    const resultado =
      await indemnizacionDAO.encontrarIndemnizacionesVerificadas();

    res.render("historial_verificado", { resultado });
  } catch (error) {
    console.error("Error al traer la información: ".error);
    res.status(500).send("Error interno");
  }
};

export const observarIndemSin = async (req, res) => {
  const noRadicado = req.params.radicado;

  try {
    const formulario = await indemnizacionDAO.buscarPorNoRadicado(noRadicado);
    if (!formulario) {
      return res.status(404).send("Formulario no encontrado");
    }

    res.render("indem_sin_verificar", { formulario });
  } catch (error) {
    console.error("Error al mostrar formulario: ", error);
    res.status(500).send("Error interno");
  }
};

export const observarIndemVerificada = async (req, res) => {
  const noRadicado = req.params.radicado;

  try {
    const formulario = await indemnizacionDAO.buscarPorNoRadicado(noRadicado);
    if (!formulario) {
      return res.status(404).send("Formulario no encontrado");
    }

    console.log(formulario);

    res.render("indem_validadas", { formulario });
  } catch (error) {
    console.error("Error al mostrar formulario: ", error);
    res.status(500).send("Error interno");
  }
};

export const registrarUsuario = async (req, res) => {
  const { nombre, correo, cedula } = req.body;

  try {
    const usuarioRegistrado = await usuarioDAO.registrar_usuario(
      nombre,
      correo,
      cedula
    );

    const id = await usuarioDAO.encontrarUsuario(correo);

    const enviar = await enviarEmail(correo, id, "TOKEN EJEMPLO");

    req.session.user = usuarioRegistrado;
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error en registro:", err);

    if (err.message === "El correo electronico ya esta registrado") {
      return res.status(400).json({ error: err.message });
    } else if (err.message === "Las contraseñas no coinciden") {
      return res.status(400).json({ error: err.message });
    } else if (err.message === "La cédula ya está registrada") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const paginaLogin = (req, res) => {
  if (req.session.user) {
    const tipo = req.session.user.tipo;
    if (tipo === 1) return res.redirect("/paginaMenuAdmin");
    if (tipo === 2) return res.redirect("/paginaMenuUser");
  }
  res.sendFile(path.join(__dirname, "..", "vistas", "login.html"));
};

export const loginProcess = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usuarioDAO.authenticate(email, password);

    req.session.user = user;

    const token = jwt.sign({ user: email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      path: "/",
    };

    res.cookie("jwt", token, cookieOptions);

    const redirectPath =
      user.tipo === 1 ? "/paginaMenuAdmin" : "/paginaMenuUser";

    return res
      .status(200)
      .json({ message: "Login exitoso", redirect: redirectPath });
  } catch (err) {
    console.error("Error en loginProcess:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir sesión:", err);
      return res
        .status(500)
        .redirect("/login.html?error=Error%20al%20cerrar%20sesión");
    }

    res.clearCookie("jwt");
    return res.redirect("/login.html"); // Redirección directa
  });
};

export const paginaMenuUser = (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 2) {
    return res.redirect("/login?error=Acceso%20denegado");
  }
  res.sendFile(path.join(__dirname, "..", "vistas", "menu_user.html"));
};

export const paginaMenuAdmin = (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 1) {
    return res.redirect("/login?error=Acceso%20denegado");
  }
  res.sendFile(path.join(__dirname, "..", "vistas", "menu_admin.html"));
};

export const mostrarGraficas = async (req, res) => {
  try {
    // Obtener años disponibles
    const aniosDisponibles = await indemnizacionDAO.obtenerAniosDisponibles();
    const anioActual = new Date().getFullYear();

    // Verificar si el año actual está en la lista, si no, usar el más reciente
    const anioSeleccionado = aniosDisponibles.includes(anioActual)
      ? anioActual
      : aniosDisponibles[0] || anioActual;

    // Obtener datos para todas las gráficas
    const estadisticasCalificaciones =
      await indemnizacionDAO.obtenerEstadisticasCalificaciones();
    const estadisticasAprobacion =
      await indemnizacionDAO.obtenerEstadisticasAprobacion();
    const indemnizacionesPorMes =
      await indemnizacionDAO.obtenerIndemnizacionesPorMes(anioSeleccionado);

    // Procesar datos para la gráfica de calificaciones
    const datosCalificaciones = {
      eficiente: 0,
      regular: 0,
      deficiente: 0,
    };

    estadisticasCalificaciones.forEach((item) => {
      const calificacion = item.calificacion.toLowerCase();
      if (datosCalificaciones.hasOwnProperty(calificacion)) {
        datosCalificaciones[calificacion] = parseInt(item.cantidad);
      }
    });

    // Procesar datos para la gráfica de aprobación
    const datosAprobacion = {
      aprobadas: 0,
      rechazadas: 0,
      pendientes: 0,
    };

    estadisticasAprobacion.forEach((item) => {
      if (item.estado === "Aprobadas") {
        datosAprobacion.aprobadas = parseInt(item.cantidad);
      } else if (item.estado === "Rechazadas") {
        datosAprobacion.rechazadas = parseInt(item.cantidad);
      } else if (item.estado === "Pendientes") {
        datosAprobacion.pendientes = parseInt(item.cantidad);
      }
    });

    // Procesar datos para la gráfica por mes
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Inicializar todos los meses con 0
    const datosPorMes = meses.map((mes, index) => {
      return {
        mes: mes,
        cantidad: 0,
      };
    });

    // Actualizar con los datos reales
    indemnizacionesPorMes.forEach((item) => {
      const mesIndex = parseInt(item.mes) - 1;
      if (mesIndex >= 0 && mesIndex < 12) {
        datosPorMes[mesIndex].cantidad = parseInt(item.cantidad);
      }
    });

    res.render("graficos_indem", {
      datosCalificaciones: JSON.stringify(datosCalificaciones),
      datosAprobacion: JSON.stringify(datosAprobacion),
      datosPorMes: JSON.stringify(datosPorMes),
      aniosDisponibles: aniosDisponibles,
      anioSeleccionado: anioSeleccionado,
      titulo: "Distribución de Calificaciones IA", // Título inicial
    });
  } catch (error) {
    console.error("Error al cargar gráficas:", error);
    res.status(500).send("Error interno");
  }
};
