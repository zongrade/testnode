const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Некорректный email').custom(async (value, req) => {
        try {
            const user = await User.findOne({ emal: value })
            if (user) {
                return Promise.reject('Такой email уже есть')
            }
        } catch (error) {
            console.log(error)
        }
    }).normalizeEmail(),
    body('password', 'Пароль от 1 до 32, латица + циферки ').isLength({ min: 1, max: 32 }).isAlphanumeric().trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }).trim(),
    body('name', 'Имя от 1 символа').isLength({ min: 1 }).trim().escape()
]
exports.courseValidators = [
    body('title', 'От 1 символа').isLength({ min: 1 }).trim(),
    body('price', 'Цена пишется циферками)').isNumeric(),
    body('img', 'Введите корректный URL').isURL(),

]
