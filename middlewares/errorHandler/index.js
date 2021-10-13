module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    err.messages = [];

    for (const property in err.keyValue) {
      err.messages.push(`${property} has been exist`);
    }
  }

  res.status(err.statusCode || 500).json({
    errors: err.messages || [err.message],
  });
};
