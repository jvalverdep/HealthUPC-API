const fs = require('fs');
const path = require('path');
const jwt = require('jwt-simple');
const config = require('../config');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const basename = path.basename(__filename);


function tokenForUser(user) {
    const timestap = new Date().getDate();
    return jwt.encode({ sub: user.id, iat: timestap }, config.secret);
}

module.exports = function(app) {
    app.get('/', (req, res, next) => {
        res.render('index.html')
    });
    app.post('/signin', requireSignin, (req, res, next) => {
        res.status(200).json({ token: tokenForUser(req.user) });
    });
    app.route('/signup')
        .post((req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const firstName = req.body.first_name;
            const lastName = req.body.last_name;
            const email = req.body.email;
            const password = req.body.password;
            if (!firstName || !lastName || !email || !password) {
                return res.status(422).json({ error: 'You must provide first_name, last_name, email and password' });
            }
            db.user.findOne({ where: { email: { [Op.eq]: email } }})
                .then(existingUser => {
                    if (existingUser) {
                        return res.status(422).json({ error: 'Email is in use' });
                    }
                    db.user.create(req.body)
                        .then(user => {
                            return res.status(201).json({ token: tokenForUser(user) });
                        })
                        .catch(error => {
                            return next(error);
                        })
                })
                .catch(error => {
                    return next(error);
                })
        });

    fs.readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && ((file === 'appointments.js') || (file === 'medical_records.js') || (file === 'consultations.js') || (file === 'treatments.js') || (file === 'doctors.js') || (file === 'patients.js')) && (file.slice(-3) === '.js');
        })
        .forEach(element => {
            require(path.join(__dirname, element))(app);
        });
}