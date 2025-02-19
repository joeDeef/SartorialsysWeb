export const queryParser = (req, res, next) => {
    const { name, last_name, email, role, active, limit, page, sortBy, sortOrder } = req.query;
  
    let filter = {};
  
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (last_name) filter.last_name = { $regex: last_name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (role) filter.role = role;
    if (active !== undefined) filter.active = active === 'true';
  
    const pagination = {};
    if (limit) pagination.limit = parseInt(limit);
    if (page) pagination.skip = (parseInt(page) - 1) * parseInt(limit);
  
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
    req.queryParams = { filter, pagination, sort };
  
    next();
  };