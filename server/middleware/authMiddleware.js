module.exports = {
  usersOnly: (req, res, next) => {
    req.session.user ? next() : res.status(401).send('Please log in')
  },
  adminsOnly: (req, res, next) => {
    req.session.user.is_admin ? next() : res.status(403).send(`You're not an admin`)
  }
}
