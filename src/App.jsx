import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
    this.addNewMessage = this.addNewMessage.bind(this);
    this.socket = new WebSocket('ws://localhost:3001/');
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    this.socket.onopen = function(e) {
      console.log('Connected to: ' + e.currentTarget.url);
    };
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    //   const messages = this.state.messages.concat(newMessage)
    //   // Update the state of the app component.
    //   // Calling setState will trigger a call to render() in App and all child components.
    //   this.setState({messages: messages})
    // }, 3000);

  // code to handle incoming message
      this.socket.onmessage = (event) => {
      //console.log(JSON.parse(event.data));
      const theOldMessage = this.state.messages;
      const theNewMessage = JSON.parse(event.data);
      const theMessage = [...theOldMessage, theNewMessage];
      this.setState({messages: theMessage});
      console.log("HELLOOOOOO", this.state.messages);
    }
  }

  addNewMessage(username, content) {
    const message = {
      type: "postMessage",
      username,
      content
    };
    this.socket.send(JSON.stringify(message));
  }

      addUser(username) {
        const user = {
          type: "postNotification",
          name: username
        };
      this.setState({currentUser: user});

      }

  render() {
    return (
      <div>
      <MessageList messages={this.state.messages} />
      <ChatBar user={this.state.currentUser.name} addNewMessage={this.addNewMessage} addUser={this.addUser} />
      </div>
    );
  }
}
export default App;
