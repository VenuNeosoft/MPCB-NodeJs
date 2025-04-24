function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'supervisor') {
      return next();
    }
    res.redirect('/admin/login');
  }
  
  module.exports = ensureAdmin;
  