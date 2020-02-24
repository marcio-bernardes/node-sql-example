import jwt from 'jsonwebtoken';

import jwtConfig from '../../../config/jwt';
import User from '../../models/User';

class SignInController {
  async store(req, res) {
    // TODO: Validate

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user.id }, jwtConfig.key, {
      expiresIn: jwtConfig.duration,
    });

    const { id, name } = user;

    return res.json({ id, name, email, token });
  }
}

export default new SignInController();
