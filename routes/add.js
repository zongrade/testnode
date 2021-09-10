const { Router } = require('express')
const auth = require('../middleware/auth')
const router = Router()
const Course = require('../models/course')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить Предмет',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
})
module.exports = router