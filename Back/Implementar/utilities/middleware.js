const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.json({ err: 'token no incluido' });
    }

    const token = req.headers['authorization'];

    let payload;
    try {
        payload = jwt.verify(token, 'aPPHusRT2024');
    } catch {
        return res.json({err: 'Token no valido'})
    }

    next();
}

module.exports = { checkToken }