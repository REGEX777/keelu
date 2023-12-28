
// Middleware to check if user is logged out
const isLoggedOut = (req, res, next) => {
    if (!req.session || !req.session.username) {
      // If session doesn't exist, proceed to the next middleware/route
      next();
    } else {
      // If session exists, redirect to a different route or return an error
      res.status(403).send('You are already logged in.');
      next()
    }
  };

module.exports = isLoggedOut;