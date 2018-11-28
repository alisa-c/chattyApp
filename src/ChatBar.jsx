import React, {Component} from 'react';

class ChatBar extends Component {


///CHANGE ONKEYDOWN TO ONCHANGE PLEASE !!!!!!/////////


 onSubmit = evt => {
    if (evt.keyCode === 13){
      const messageInput = evt.target;
      this.props.addNewMessage(this.props.user, messageInput.value);
      messageInput.value = "";
    }
  };

onEnter = evt => {
    if (evt.keyCode === 13){
      const userInput = evt.target;
      this.props.addUser(userInput.value);
    }
  };



  render() {
    return (
     <footer className="chatbar">
        <input className="chatbar-username" onKeyDown={this.onEnter} placeholder="Your Name (Optional)" />
          <input className="chatbar-message"  onKeyDown={this.onSubmit} placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}
export default ChatBar;
