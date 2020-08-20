const http = require("http")
const fs = require('fs')

let zip = __dirname + "/dummy.zip"
const server = http.createServer((req, res) => {

    fs.access(zip, fs.constants.F_OK, err =>{
        console.log(`${zip} ${err ? "does not exist" : "exists"}`);
    })

    fs.readFile(zip, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-type": "text/html"})
        }
        else {
            res.writeHead(200, {"Content-type": "application/zip"})
            res.end(content)
        }
    })

})
server.listen(1234, () =>{console.log("localhost:1234");})