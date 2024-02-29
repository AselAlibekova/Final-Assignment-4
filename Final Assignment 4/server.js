const express = require('express')
const http = require('http')
const sampleRoutes = require('./routes/sample')
const { connectMongodb } = require('./mongodb')
const qr = require('qrcode');


const app = express();
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});
app.use(express.json())
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login/login.html');
})

app.use('/api', sampleRoutes)

const PORT = process.env.PORT || 3000



connectMongodb()
    .then(() => {
        server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
    })
    .catch((error) => {
        console.error("Failed to connect to the Mongodb", error)
        process.exit(1)
    })


