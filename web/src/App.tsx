import { useEffect, useState } from 'react';
import logo from '/logo.png';
import './App.css';

function App() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch('/api/version')
      .then((res) => res.text())
      .then(setVersion);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);
    socket.onopen = function () {
      socket.onmessage = function (data) {
        console.log('onmessage: ', data);
      };
    };
  }, []);

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="App logo" />
      </div>
      <h1>Welcome</h1>
      <div>
        <p>{version}</p>
      </div>
    </>
  );
}

export default App;
