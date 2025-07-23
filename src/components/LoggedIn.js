import React from 'react';

function LoggedIn({ client, dmUserId, setDmUserId, startDm, handleLogout, error }) {
  return (
    <div className="App">
      <header className="App-header">
        <p>Logged in as {client.getUserId()}</p>
        <input
          type="text"
          value={dmUserId}
          onChange={(e) => setDmUserId(e.target.value)}
        />
        <button onClick={startDm}>Start DM</button>
        <button onClick={handleLogout} style={{marginTop: '1rem'}}>Logout</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default LoggedIn; 