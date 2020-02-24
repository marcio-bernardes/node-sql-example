import User from '../models/User';

class UserController {
  async update(req, res) {
    // TODO: validation

    const { email, oldPassword } = req.body;

    // authenticated user
    const user = await User.findByPk(req.user.id);

    // user can't change the email to registered one
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // old password should match
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password doesn't match." });
    }

    try {
      await user.update(req.body);

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async index(req, res) {
    try {
      const all = await User.findAll();

      const users = all.map(user => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });

      return res.json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UserController();
