// small helper to compute skip/limit
function getPagination(page = 1, limit = 10) {
  page = parseInt(page) || 1;
  limit = Math.min(parseInt(limit) || 10, 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { getPagination };
