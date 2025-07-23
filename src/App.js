import React, { useState, useEffect } from 'react';
import * as sdk from 'matrix-js-sdk';
import './App.css';
import Login from './components/Login';
import DmChatWindow from './components/DmChatWindow';
import LoggedIn from './components/LoggedIn';

function App() {
  const [homeserver] = useState('http://pocket-wm.local:8008');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);
  const [dmUserId, setDmUserId] = useState('@metabot:pocket-wm.local');
  const [dmRoomId, setDmRoomId] = useState(null);
  const [step, setStep] = useState('email'); // 'email' or 'password'

  useEffect(() => {
    const storedClient = localStorage.getItem('matrix-client');
    if (storedClient) {
      const { homeserver, userId, accessToken, deviceId } = JSON.parse(storedClient);
      const matrixClient = sdk.createClient({
        baseUrl: homeserver,
        userId,
        accessToken,
        deviceId,
      });
      setClient(matrixClient);
    }
  }, []);

  useEffect(() => {
    if (client) {
      client.startClient({ initialSyncLimit: 10 });
      client.once('sync', (state, prevState, res) => {
        console.log(state); // state will be 'PREPARED' when the client is ready
      });
    }
  }, [client]);

  const handleNext = () => {
    if (username.trim() !== '') {
      setStep('password');
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const matrixClient = sdk.createClient({
        baseUrl: homeserver,
      });

      const response = await matrixClient.loginWithPassword(username, password);
      localStorage.setItem('matrix-client', JSON.stringify({
        homeserver,
        userId: response.user_id,
        accessToken: response.access_token,
        deviceId: response.device_id,
      }));
      setClient(matrixClient);
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleLogout = async () => {
    try {
      if (client) {
        await client.logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('matrix-client');
      setClient(null);
      setDmRoomId(null);
    }
  };

  const startDm = async () => {
    try {
      const result = await client.createRoom({
        is_direct: true,
        invite: [dmUserId],
        preset: 'private_chat',
        visibility: 'private'
      });
      setDmRoomId(result.room_id);

      // Designate this as the management room
      client.sendEvent(result.room_id, 'm.room.message', {
        body: '!meta set-management-room',
        msgtype: 'm.text',
      });
      
      // Automatically send the login command
      setTimeout(() => {
        client.sendEvent(result.room_id, 'm.room.message', {
          body: '!meta login instagram',
          msgtype: 'm.text',
        });
      }, 1000);
    } catch (err) {
      setError(err.toString());
    }
  };

  if (dmRoomId) {
    return <DmChatWindow dmUserId={dmUserId} client={client} dmRoomId={dmRoomId} />;
  }

  if (client) {
    return <LoggedIn client={client} dmUserId={dmUserId} setDmUserId={setDmUserId} startDm={startDm} handleLogout={handleLogout} error={error} />;
  }

  return (
    <div className="App">
      <Login 
        handleNext={handleNext}
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        step={step}
        error={error}
      />
    </div>
  );
}

export default App;
