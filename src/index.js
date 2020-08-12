const express = require ('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// Maintain mode
//app.use((req, res, next) => {
//    res.status(503).send('Site is currently down. Check back soon!')
//}) 
//...........

app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}` );
})

