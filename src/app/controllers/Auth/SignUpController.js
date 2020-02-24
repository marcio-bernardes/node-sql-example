import jwt from 'jsonwebtoken';

import User from '../../models/User';
import jwtConfig from '../../../config/jwt';

class SignUpController {
  async store(req, res) {
    // TODO: Validation

    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      const user = await User.create({ name, email, password });

      const token = jwt.sign({ id: user.id }, jwtConfig.key, {
        expiresIn: jwtConfig.duration,
      });

      return res.json({ id: user.id, name, email, token });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

export default new SignUpController();
