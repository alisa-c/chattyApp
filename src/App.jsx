import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";
import NavBar from "./NavBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous", color: ''}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      amountUsers: 0
    };
    this.socket = new WebSocket('ws://localhost:3001/');
    this.addNewMessage = this.addNewMessage.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    this.socket.onopen = function(e) {
      console.log('Connected to: ' + e.currentTarget.url);
    };
    // code to handle incoming message
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'color') {
        const color = data.color;
        this.setState({currentUser: {name: "Anonymous", color :color}});

      } else if (data.type === 'count') {
        const count = data;
        this.setState({amountUsers: count.amount});

      } else if (data.type === "incomingNotification" || data.type === "incomingMessage" || data.type === "incomingGiphy"){
      const theOldMessage = this.state.messages;
      const theNewMessage = data;
      const theMessage = [...theOldMessage, theNewMessage];
      this.setState({messages: theMessage});
      }
    }
  }

  //Function to send users input message to ws server
  addNewMessage(username, content) {
    const message = {
      type: "postMessage",
      username,
      color: this.state.currentUser.color,
      content
    };
    this.socket.send(JSON.stringify(message));
  }

  //Function to change username sending name to the server & setting state
  addUser(username) {
    const user = {
      type: "postNotification",
      content: `${this.state.currentUser.name} changed their name to ${username}`,
    };
  this.socket.send(JSON.stringify(user));
  this.setState({currentUser: {name :username, color: this.state.currentUser.color}});
  }

  //sending states to children
  render() {
    return (
      <div>
        <NavBar usercount={this.state.amountUsers} />
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser.name} addNewMessage={this.addNewMessage} addUser={this.addUser} />
      </div>
    );
  }
}
export default App;
