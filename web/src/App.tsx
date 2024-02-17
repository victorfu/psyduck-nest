import logo from '/logo.png';
import './App.css';
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from 'react-router-dom';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const { user } = useRouteLoaderData('root') as { user: string | null };

  useEffect(() => {
    console.log('user: ', user);
  }, [user]);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);
    socket.onopen = function () {
      socket.onmessage = function (data) {
        console.log('onmessage: ', data);
      };
    };
  }, []);

  return (
    <div className={`flex h-screen`}>
      <aside
        className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-48'} transition-width duration-300`}
      >
        <div className="flex items-center justify-center h-12">
          <img src={logo} className="logo" alt="App logo" />
        </div>
        <div className="p-2">
          <Link
            to="/page-one"
            className={`flex items-center p-2 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${pathname === '/page-one' ? 'bg-gray-700' : ''}`}
          >
            <UserOutlined className="mr-2" />
            {!collapsed && <span>Page One</span>}
          </Link>
          <Link
            to="/page-two"
            className={`flex items-center p-2 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${pathname === '/page-two' ? 'bg-gray-700' : ''}`}
          >
            <VideoCameraOutlined className="mr-2" />
            {!collapsed && <span>Page Two</span>}
          </Link>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="bg-gray-50 text-left p-4">
          <button onClick={() => setCollapsed(!collapsed)} className="text-xl">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
