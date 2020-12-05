// Переменные
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request-error');
const AccessError = require('../errors/access-error');
const {
    userCreatedMsg,
    userJoinMsg,
    notValidMsg,
    emailNotUniqueMsg,
    passNotValidMsg,
} = require('../scripts/errors-success-msg');
const { devSecret, partTitle } = require('../scripts/config');
const auth = require('../middlewars/auth');
const { nav } = require('./nav');
const { getMovie } = require('../middlewars/api');

const { NODE_ENV, JWT_SECRET } = process.env;


// Создание пользователя
module.exports.createUser = (req, res, next) => {
    try {
        if (req.body.password.length < 8) {
            throw new BadRequest(passNotValidMsg);
        }
    } catch (err) {
        return next(err);
    }
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            }, (err, user) => {
                try {
                    if (err != undefined || user == undefined) {
                        if (err.code === 11000) {
                            next(new BadRequest(emailNotUniqueMsg));
                            return;
                        }
                        next(new BadRequest(notValidMsg));
                        return;
                    }
                    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devSecret, { expiresIn: '7d' });
                    res
                        .status(200)
                        .cookie('jwt', token, {
                            maxAge: 3600000,
                            httpOnly: true,
                            sameSite: true,
                        })
                        .send({
                            message: userCreatedMsg,
                        })
                        .end();
                } catch (err) {
                    next(err);
                }
            });
        });
};

// Вход пользователя
module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    let userId = '';
    User.findOne({ email }).select('+password')
        .then((user) => {
            if (!user) {
                throw new AccessError(notValidMsg);
            }
            userId = user._id;
            return bcrypt.compare(password, user.password);
        })
        .then((matched) => {
            if (!matched) {
                throw new AccessError(notValidMsg);
            }
            const token = jwt.sign({ _id: userId }, NODE_ENV === 'production' ? JWT_SECRET : devSecret, { expiresIn: '7d' });
            res
                .status(200)
                .cookie('jwt', token, {
                    maxAge: 3600000,
                    httpOnly: true,
                    sameSite: true,
                })
                .send({
                    message: userJoinMsg,
                    jwt: token,
                })
                .end();
        })
        .catch(next);
};

module.exports.logout = (req, res, next) => {
    console.log(req.url);
    res.clearCookie('jwt');
    res.redirect('back');
}

// Получить своего пользователя
module.exports.getUser = async (id) => {
    const userId = id;
    let result = '';
    await User.findById(userId)
        .then((user) => {
            return result = user;
        })
        .catch((err) => console.log(err));
    return result;
};

module.exports.getAccountPage = async (req, res, next) => {
    const user = await auth(req, res, next);
    const title = partTitle + 'Account Page';
    const header = await nav();
    const moviesArray = await getMovie(user.films);

    const resData = {
        isAuth: (!user) ? false : true,
        userId: user._id,
        userName: user.name,
        userFilms: user.films,
        title: title,
        nav: header.genres,
        results: moviesArray,
    };
    if (!resData.isAuth) {
        res.redirect('/');
    } else {
        return await res.render("main", { data: resData });
    }
}

module.exports.addFilmToUser = async (req, res, next) => {
    const user = await auth(req, res, next);
    if (user.films.indexOf(req.body.filmId) == -1) {
        user.films.push(Number(req.body.filmId));
        user.save();
        console.log(user);
        res
            .status(200)
            .send('Success add movie from user');
    } else {
        res
            .status(400)
            .send(`Movie already exist`);
    }
}

module.exports.deleteFilmFromUser = async (req, res, next) => {
    const user = await auth(req, res, next);
    if (user.films.find((i) => i === Number(req.body.filmId))) {
        user.films.pull(Number(req.body.filmId));
        user.save();
        console.log(user);
        res
            .status(200)
            .send('Success delete movie from user');
    } else {
        res
            .status(404)
            .send(`Not found movie with this ID`);
    }
}