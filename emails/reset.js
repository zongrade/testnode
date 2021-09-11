const keys = require('../keys')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Сброс пароля',
        html:
            `
            <h1>Собсна письмо с новым паролем</h1>
            <p>Проигнорируйте письмо, если не хотите менять пароль</p>
            <p>Нажмите на ссылку, если решили сменить пароль</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Сброс пароля</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Собсно сам сайт</a>
            <hr/>
            *Собсно - собственно
            `
    }
}
//cat
//12
//https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg

//dog
//1235
//https://randomwordgenerator.com/img/picture-generator/52e9d3414854aa14f1dc8460962e33791c3ad6e04e507441722a72dd964bc7_640.jpg

//big cat
//12567
//https://randomwordgenerator.com/img/picture-generator/52e1d5424b56aa14f1dc8460962e33791c3ad6e04e50744074267bd69149c7_640.jpg

//lion
//100000
//https://randomwordgenerator.com/img/picture-generator/tiger-2430625_640.jpg