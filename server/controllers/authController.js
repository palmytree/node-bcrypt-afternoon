const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body,
      db = req.app.get('db'),
      result = await db.get_user(username),
      existingUser = result[0]

    if (existingUser) return res.status(409).send('Username taken')
    if (username.length < 5) return res.status(406).send('Username must be at least 5 characters')

    const salt = bcrypt.genSaltSync(10),
      hash = bcrypt.hashSync(password, salt),
      registeredUser = await db.register_user(isAdmin, username, hash),
      user = registeredUser[0],
      { is_admin, id, username: newUsername } = user

    req.session.user = { id, isAdmin: is_admin, username: newUsername }

    res.status(201).send(req.session.user)
  },
  login: async (req, res) => {
    const { username, password } = req.body,
      db = req.app.get('db'),
      foundUser = await db.get_user(username),
      user = foundUser[0]

    if (!user) {
      return res.status(401).send('User not found. Please register as a new user before logging in')
    }

    const isAuthenticated = bcrypt.compareSync(password, user.hash)

    if (!isAuthenticated) return res.status(403).send('Incorrect Password')

    delete user.hash

    req.session.user = user

    res.status(200).send(req.session.user)
  },
  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  }
}
