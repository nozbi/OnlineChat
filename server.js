const http = require("http");
const fs = require("fs");
const WebSocketServerClass = require("websocket").server;

var clients = [];
var messages = [];
//var file = fs.readFileSync("./client.html");

const server = http.createServer(function(request, response)
{
    if(request.url == "/")
    {
        response.write(fs.readFileSync("./client.html"));
        response.end();
    }
});
server.listen(3000);

const webSocketServer = new WebSocketServerClass({httpServer:server});
webSocketServer.on("request", function(request)
{
    const connection = request.accept();
    clients.push(connection);
    console.log("USER CONNECTED!");
    var nickSet = false;
    var nick;

    for(var i = 0; i < messages.length; i++)
    {
        connection.send(messages[i]);
    }
    
    connection.on("message", function(message)
    {   if(nickSet == false)
        {
            if(message.utf8Data == "")
            {
                nick = "guest";
                nickSet = true;
            }
            else
            {
                nick = message.utf8Data;
                nickSet = true;
            }
        }
        else
        { 
            var text1 = nick + ":";
            var text2 = message.utf8Data;
            console.log(text1);
            console.log(text2);
            messages.push(text1);
            messages.push(text2);
            for(var i = 0; i < clients.length; i++)
            {
                clients[i].send(text1);
                clients[i].send(text2);
            }  
        }
    })

   connection.on("close", function()
   {
       console.log("USER DISCONNECTED!");
       clients.splice(clients.indexOf(connection), 1);
   })   
})

