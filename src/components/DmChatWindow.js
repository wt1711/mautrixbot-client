import React from 'react';
import Chat from './Chat'; // Assuming Chat component is in the same directory or adjust path

function DmChatWindow({ dmUserId, client, dmRoomId }) {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Chat with {dmUserId}</h2>
        <p>Setting management room and sending login command. Please wait for the bot to respond, then enter your credentials.</p>
        <Chat client={client} roomId={dmRoomId} />
      </header>
    </div>
  );
}

export default DmChatWindow; 