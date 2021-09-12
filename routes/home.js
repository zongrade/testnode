const { Router } = require('express')
const router = Router()
const fs = require('fs')

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная Страница',
        isHome: true
    })
})
router.post('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=testnode.7z"
    });
    fs.createReadStream('./download/testnode.7z').pipe(res)
})
module.exports = router