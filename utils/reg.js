var _ = require('lodash');

const matchText = (input) => {
    if (!input.match(/\^[a-zA-Z0-9]\w+/)) {
        return true
    }
    return false
}

let a = '<script>'
let b = '</script>'
let c = 'scri pt-'
let d = "admin1234"

var safeKey = _.escapeRegExp(a);
var safeKey2 = _.escapeRegExp(b);
var safeKey3 = _.escapeRegExp(c);
  var re = new RegExp("\\b" + safeKey + "=(.*)\n");

//console.log( "a is: "+ re )

if (!/^[a-z0-9-]+$/.test(c)) {
    return console.log("Illegal");
}


module.exports = matchText