const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');
const fetch = require('node-fetch');
const querystring = require('query-string');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

//Function to send data to all connected users
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
      client.send(data);
  });
};

//Function to add random hexcode color to username
function generateColor () {
  let color = '#' +  Math.random().toString(16).substr(-6)
  return color;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  //Send client data each time a user is conncected
  const countUsers = {
    type: 'count',
    amount: JSON.stringify(wss.clients.size)
  }
  wss.broadcast(JSON.stringify(countUsers));

//Sends each user a color for their username
  const userColor = {
    type: 'color',
    color: generateColor()
  }
  ws.send(JSON.stringify(userColor));

// Function to handle incoming messages from the client
  ws.on('message', function (event) {

    const data = JSON.parse(event);

    //switch case method to check if its a message or notification(which is user updating name)
    switch(data.type) {
      case "postMessage":
        const updateMessage = data;

        //Checks message content for /giphy and then sends request to giphy api to retrive a giphy with users input
        const matchGiphy= data.content.match(/^\/giphy (.+)/);
        if (matchGiphy) {
          const qs = querystring.stringify({
            api_key: "gEmlhB3f5SogYANMaSeV2sRBZQYyagqH",
            tag: matchGiphy[1]
          });
          //fetch is the new way to do ajax calls ...simialr to jquery... IT IS TO REPLACE AJAX!
          fetch(`https://api.giphy.com/v1/gifs/random?${qs}`)
          .catch( error => console.log(error))
            .then( resp => resp.json())
            .then( json => {
              updateMessage.type = "incomingGiphy";
              updateMessage.id = uuidv4();
              updateMessage.content = `<div><img src="${json.data.images.downsized.url}" alt="${matchGiphy[1]}"/></div>`

              wss.broadcast(JSON.stringify(updateMessage));
            })

        } else {
        updateMessage.id = uuidv4();
        updateMessage.type = "incomingMessage";
        wss.broadcast(JSON.stringify(updateMessage));
        }
        break;

      case "postNotification":
        const notification = data;
        notification.type = "incomingNotification";
        notification.id = uuidv4();
        wss.broadcast(JSON.stringify(notification));
        break;

      default:
        // shows an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
    }
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
      const countUsers = {
        type: 'count',
        amount: JSON.stringify(wss.clients.size)
      }
    wss.broadcast(JSON.stringify(countUsers));
  });
});

