
const UserPatt = (str) => {
    const pattern = /^[A-Za-z0-9-_+]{3,20}$/

    if (!pattern.test(str)) return false
    
    return true
}

const CodePatt = (str) => {
    const pattern = /^[a-zA-Z-0-9]{6,16}$/
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

const InputPatt = (str) => {
    const pattern = /^[A-Za-z0-9\s]{3,40}$/

    if (!pattern.test(str)) return false
    
    return true
}
const StatePatt = (str) => {
    const pattern = /Italia|Europa|Estero/

    if (!pattern.test(str)) return false
    
    return true
}
const NumberPatt = (number) => {
    const pattern = /^[0-9-]{3,12}$/

    if (!pattern.test(number)) return false
    
    return true
}

const ZipPatt = (number) => {
    const pattern = /^[A-Za-z0-9-]{5,10}$/

    if (!pattern.test(number)) return false
    
    return true
}
const MongoPatt = (id) => {
    const pattern = /^[a-f\d]{24}$/

    if (!pattern.test(id)) return false
    
    return true
}

//const ArchPatt = (archive) => {
//    if ( archive ) 
 //       return true

   // return false
//}










// EXPORT
module.exports.UserPatt = UserPatt
module.exports.PswPatt = PswPatt
module.exports.MailPatt = MailPatt
module.exports.CodePatt = CodePatt
module.exports.InputPatt = InputPatt
module.exports.StatePatt = StatePatt
module.exports.NumberPatt = NumberPatt
module.exports.ZipPatt = ZipPatt
module.exports.MongoPatt = MongoPatt



   // DEBUG 
   /*
   console.log(CodePatt(code))
   console.log(InputPatt(firstName))
   console.log(InputPatt(lastName))
   console.log(InputPatt(address))
   console.log(InputPatt(city))
   console.log(StatePatt(state))
   console.log(ZipPatt(zipCode))
   console.log(MailPatt(email))
   console.log(NumberPatt(phone))
   console.log(CodePatt('FNNSVT95R11A089J'))
   */
