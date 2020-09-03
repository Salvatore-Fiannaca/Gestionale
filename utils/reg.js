
const matchText = (input) => {
    if (!input.match(/\^[a-zA-Z0-9]\w+/)) {
        return true
    }
    return false
}

let a = '<script>'
let b = '</script>'
let c = 'script.#'
let d = "admin1234"

console.log( "a is: " + matchText(a) )
console.log( "b is: " + matchText(b) )
console.log( "c is: " + matchText(c) )
console.log( "d is: " + matchText(d) )

module.exports = matchText