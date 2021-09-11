const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Регистрация произведена',
        html:
            `
            <h1>Собсна письмо с регистрацией</h1>
            <p>Аккаунт создан на вот этот mail: ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Собсно сам сайт</a>
            <hr/>
            *Собсно - собственно
            `
    }
}