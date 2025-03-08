export const productQueryParser = (req, res, next) => {
  const {
    name,
    category,
    size,
    color,
    available,
    deleted,
    priceMin,
    priceMax,
    limit,
    page,
    sortBy,
    sortOrder,
  } = req.query;

  let filter = {};

  // Filtros de búsqueda
  if (name) filter.name = { $regex: name, $options: "i" };
  if (category) filter.category = category;

  if (available !== undefined) {
    filter.available = available === "true";
  } else {
    filter.available = true;
  }

  if (deleted === undefined) {
    filter.deleted = false;
  } else {
    filter.deleted = deleted === "true";
  }
  // Filtros para precios
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = parseFloat(priceMin); // Mayor o igual que priceMin
    if (priceMax) filter.price.$lte = parseFloat(priceMax); // Menor o igual que priceMax
  }

  // Filtros para inventario (talla y color)
  if (size) {
    filter["inventory.size"] = size; // Filtrar por talla
  }

  if (color) {
    filter["inventory.color.name"] = color; // Filtrar por color
    filter["inventory.color.available"] = true; // Solo mostrar colores disponibles
  }

  // Paginación
  const pagination = {};
  if (limit) pagination.limit = parseInt(limit); // Limitar la cantidad de productos
  if (page) pagination.skip = (parseInt(page) - 1) * parseInt(limit); // Paginación, skip depende de la página

  // Ordenación
  const sort = {};
  if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1; // Ordenar de acuerdo al campo y el orden (asc/desc)

  // Guardar los parámetros en la solicitud para usar en la consulta
  req.queryParams = { filter, pagination, sort };

  next();
};
