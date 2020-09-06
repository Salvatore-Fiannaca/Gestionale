
const UserPatt = (str) => {
    const pattern = /^[A-Za-z0-9-_+]{3,20}$/

    if (!pattern.test(str)) return false
    
    return true
}

const PswPatt = (str) => {
    const pattern = /^[A-Za-z0-9-+_]{6,20}$/

    if (!pattern.test(str)) return false
    
    return true
}

const MailPatt = (mail) => {
    if (
        mail.indexOf("@") !== -1 & 
        mail.length > 6 &
        mail.length < 40
        ) 
        return true

    return false
}

module.exports.UserPatt = UserPatt
module.exports.PswPatt = PswPatt
module.exports.MailPatt = MailPatt