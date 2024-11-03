const http = require('http');
const { WebSocketServer} = require('ws')

const url = require('url');

const server = http.createServer()

const webServer = new WebSocketServer({server})
const port = 8000

const connections = {}
const users = {}

const broadcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message)
    })
}

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];
    user.state = message;

    broadcast();

    console.log(message);
}

const handleClose = (uuid) => {


    console.log('user is disconnected')
    delete connections[uuid];
    delete users[uuid];

    broadcast();
}

webServer.on("connection", (connection, request) =>  {
    // ws://localhost:8000
    const {username} = url.parse(request.url, true).query
    const uuid = crypto.randomUUID();

    // broadcast // fan out
    connections[uuid] = connection

    users[uuid] = {
        username,
        state: {}
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))

})

server.listen(port, () => {
    console.log(`websocket server is running on port ${port}`)
})