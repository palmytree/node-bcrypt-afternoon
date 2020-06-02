module.exports = {
  dragonTreasure: async (req, res) => {
    const db = req.app.get('db'),
      result = await db.get_dragon_treasure(1)

    res.status(200).send(result)
  },
  getUserTreasure: async (req, res) => {
    const db = req.app.get('db'),
      result = await db.get_user_treasure(req.session.user.id)

    res.status(200).send(result)
  },
  addUserTreasure: async (req, res) => {
    const { treasureURL } = req.body,
      { id } = req.session.user,
      db = req.app.get('db'),
      userTreasure = await db.add_user_treasure(treasureURL, id)

    res.status(200).send(userTreasure)
  },
  getAllTreasure: async (req, res) => {
    const db = req.app.get('db'),
      result = await db.get_all_treasure()

    res.status(200).send(result)
  }
}
