import React, {Component} from 'react';

class Message extends Component {
  render() {

    let userColor = {color: this.props.message.color}
    let messageColor = {backgroundColor: this.props.message.color}

    //Checks for the message type and returns html accordingly
    if (this.props.message.type === 'incomingNotification'){
      return (
        <div className="notification">
         <span className="notification-content">{this.props.message.content}</span>
        </div>
      );

    } else if (this.props.message.type === 'incomingGiphy'){
      return(
        <div>
          <div className="message">
            <span style={userColor} className="message-username">{this.props.message.username} </span>
            <span className="message-content" style={messageColor} dangerouslySetInnerHTML={{__html: this.props.message.content}}></span>
          </div>
        </div>
      );

    } else if (this.props.message.type === 'incomingMessage'){
      return (
        <div>
          <div className="message">
            <span style={userColor} className="message-username">{this.props.message.username} </span>
            <span className="message-content" style={messageColor}> {this.props.message.content} </span>
          </div>
        </div>
      );
    }
  }
}

export default Message;


