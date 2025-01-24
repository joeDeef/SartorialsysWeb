import * as multiparty from 'multiparty'; // Importa multiparty correctamente

// Configuración del middleware
const multipartyMiddleware = (req, res, next) => {
  const form = new multiparty.Form({ uploadDir: './uploads' });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    req.fields = fields;
    req.files = files;
    next();
  });
};

export { multipartyMiddleware };
