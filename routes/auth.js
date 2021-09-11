const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const crypto = require('crypto')
const keys = require('../keys')
const router = Router()
const nodemailer = require('nodemailer')
const regEmail = require('../emails/registrations')
const resetEmail = require('../emails/reset')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: 'zongrade@gmail.com',
        pass: keys.PASSWORD_GMAIL,
    }
})
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Нет такого пользователя')
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error)
    }

})
router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            req.flash('registerError', 'Email занят')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({ email, name, password: hashPassword, cart: { items: [] } })
            await user.save()
            await transporter.sendMail(regEmail(email))
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error)
    }
})
router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановить пароль',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Позже попробуйте')
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')

            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 15 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Нема такого email-a')
                res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        console.log(error);
    }
})
router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({ resetToken: req.params.token, resetTokenExp: { $gt: Date.now() } })
        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить пароль',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (error) {
        console.log(error)
    }


})
router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Токен истёк, либо пользователь не найден')
            res.redirect('auth/login')
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router