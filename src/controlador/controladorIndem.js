const IndemnizacionModel = require('../modelo/DAO_indemnizacion');

class IndemnizacionController {
  async mostrarDetalle(req, res) {
    try {
      const { radicado } = req.params;
      const indemnizacion = await IndemnizacionModel.getByRadicado(radicado);
      
      if (!indemnizacion) {
        console.log("indem no entrado");
        return res.status(404).send("Radicado no encontrado");
      }

      // Convertir a objeto si es string
      let formData = indemnizacion.formIngresado;
      if (typeof formData === 'string') {
        try {
          formData = JSON.parse(formData);
        } catch (e) {
          formData = {};
        }
      }

      // Función para formatear fechas
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          // Formato simple para fechas ISO (AAAA-MM-DD)
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
          }
          
          // Para objetos Date o timestamps
          const date = new Date(dateString);
          return date.toLocaleDateString('es-ES');
        } catch (e) {
          return dateString;
        }
      };

      // Formatear fechas conocidas
      const formattedData = { ...formData };
      const dateFields = [
        'evento.fecha', 
        'victima.fecha_nacimiento',
        'victima.fecha_muerte',
        'vehiculo.vigencia_desde',
        'vehiculo.vigencia_hasta'
      ];
      
      dateFields.forEach(field => {
        if (formattedData[field]) {
          formattedData[field] = formatDate(formattedData[field]);
        }
      });

      // Agrupar datos por secciones
      const groupedData = {
        evento: {},
        victima: {},
        vehiculo: {},
        reclamacion: {},
        apoderado: {},
        beneficiario: {},
        conductor: {},
        propietario: {}
      };
      
      // Organizar los datos en secciones
      Object.keys(formattedData).forEach(key => {
        const [section, field] = key.split('.');
        if (groupedData[section]) {
          groupedData[section][field] = formattedData[key];
        }
      });

      // Función para normalizar texto
      const normalizeText = (text) => {
        if (!text) return '';
        return text
          .replace(/ß/g, 'á')
          .replace(/Ú/g, 'é')
          .replace(/Ý/g, 'í')
          .replace(/¾/g, 'ó')
          .replace(/º/g, 'ú')
          .trim();
      };

      res.render('formulario_guardado', {
        title: `Detalle de Radicado ${radicado}`,
        radicado: indemnizacion.noRadicado,
        fechaRadicacion: formatDate(indemnizacion.fechaRadicacion),
        groupedData,
        normalizeText
      });

    } catch (error) {
      console.error('Error al obtener indemnización:', error);
      res.status(500).send("Radicado no encontrado");
    }
  }

  async listarRadicados(req, res) {
    try {
      const userId = req.session.user.id;
      const radicados = await IndemnizacionModel.encontrarIndemnizaciones(userId);
      
      // Función para formatear fechas
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (e) {
          return dateString;
        }
      };
      
      res.render('index', {
        title: 'Sistema de Gestión de Indemnizaciones',
        radicados: radicados.map(r => ({
          ...r,
          fechaFormateada: formatDate(r.fechaRadicacion)
        }))
      });
    } catch (error) {
      console.error('Error al listar radicados:', error);
      res.status(500).render('error', {
        mensaje: 'Error interno del servidor',
        layout: 'layouts/main'
      });
    }
  }
}



module.exports = new IndemnizacionController();