import React from 'react';

function Login({ handleNext, handleLogin, username, setUsername, password, setPassword, step, error }) {
  const renderLoginStep = () => {
    if (step === 'email') {
      return (
        <>
          <img src="https://i.imgur.com/4Yj0hK8.png" alt="Email graphic" className="login-graphic" />
          <h1>Enter your Email</h1>
          <input
            type="text"
            placeholder="Email"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="login-button" onClick={handleNext}>Next</button>
        </>
      );
    } else {
      return (
        <>
          <h1>Enter your Password</h1>
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
        </>
      );
    }
  };

  return (
    <div className="login-container">
      <div className="window-bar">
        <div className="window-dots">
          <div className="dot dot-red"></div>
          <div className="dot dot-yellow"></div>
          <div className="dot dot-green"></div>
        </div>
        <div className="window-arrow">▼</div>
      </div>
      <header className="App-header">
        {renderLoginStep()}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </header>
    </div>
  );
}

export default Login; 