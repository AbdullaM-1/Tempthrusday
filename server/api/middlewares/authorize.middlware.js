const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001300",
      },
    });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001303",
      },
    });
  }
  next();
};

const isUserOrAdmin = (req, res, next) => {
  if (req.user.role !== "USER" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001302",
      },
    });
  }
  next();
};

module.exports = { isAdmin, isUser, isUserOrAdmin };
