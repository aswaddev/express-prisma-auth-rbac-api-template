export const Role = (role) => {
  return (req, res, next) => {
    if (req.user.roles.indexOf('Superadmin') >= 0) return next();

    if (req.user.roles.includes(role)) return next();

    res.status(401);

    throw new Error('Unauthorized, token invalid.');
  };
};

export const RoleAny = (roles) => {
  return (req, res, next) => {
    if (req.user.roles.indexOf('Superadmin') >= 0) return next();
    if (roles.every((role) => req.user.roles.includes(role))) return next();

    res.status(401);
    throw new Error('Unauthorized, token invalid.');
  };
};

export const Can = (permission) => {
  return (req, res, next) => {
    if (req.user.roles.indexOf('Superadmin') >= 0) return next();

    if (req.user.permissions.includes(permission)) return next();

    res.status(401);

    throw new Error('Unauthorized, token invalid.');
  };
};

export const CanAny = (permissions) => {
  return (req, res, next) => {
    if (req.user.roles.indexOf('Superadmin') >= 0) return next();

    if (
      permissions.every((permission) =>
        req.user.permissions.includes(permission)
      )
    )
      return next();

    res.status(401);
    throw new Error('Unauthorized, token invalid.');
  };
};
