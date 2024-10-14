const adminAuth = (req, res, next) => {
  console.log("Admin authentication is getting checked...");
  const token = "xyscz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Forbidden: Only admins can access all data");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("User authentication is getting checked...");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Forbidden: Only users are allowed");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
