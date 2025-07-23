import React, { useState, useEffect, useCallback, useRef } from 'react';

function Chat({ client, roomId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTimeline = useCallback((event) => {
    if (event.getRoomId() === roomId && event.getType() === 'm.room.message' && event.getContent().body) {
      setMessages((prevMessages) => {
        if (prevMessages.find(e => e.getId() === event.getId())) {
          return prevMessages;
        }
        return [...prevMessages, event];
      });
    }
  }, [roomId]);

  useEffect(() => {
    if (client && roomId) {
      const room = client.getRoom(roomId);
      if (room) {
        const initialEvents = room.getLiveTimeline().getEvents()
          .filter(e => e.getType() === 'm.room.message' && e.getContent().body);
        setMessages(initialEvents);
      }
      client.on('Room.timeline', handleTimeline);
    }
    return () => {
      if (client) {
        client.removeListener('Room.timeline', handleTimeline);
      }
    };
  }, [client, roomId, handleTimeline]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    client.sendEvent(roomId, 'm.room.message', {
      body: message,
      msgtype: 'm.text',
    });
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatboxRef}>
        {messages.map((event) => (
          <div key={event.getId()}>
            <strong>{event.getSender()}:</strong> {event.getContent().body}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="login-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="login-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat; 