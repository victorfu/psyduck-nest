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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src={logo} className="logo" alt="App logo" />
      <div>{version}</div>
    </div>
  );
}

export default App;
