import logo from '/logo.png';
import './App.css';
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import {
  Link,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from 'react-router-dom';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [broken, setBroken] = useState(false);
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
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={broken ? 0 : 70}
        onBreakpoint={(broken) => {
          setBroken(broken);
        }}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
      >
        <div className="flex items-center justify-center h-12">
          <img src={logo} className="logo" alt="App logo" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={[
            {
              key: '/page-one',
              icon: <UserOutlined />,
              label: <Link to="/page-one">Page One</Link>,
            },
            {
              key: '/page-two',
              icon: <VideoCameraOutlined />,
              label: <Link to="/page-two">Page Two</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="p-0 bg-gray-50">
          <Button
            className="!w-16 !h-16"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content
          className="p-4"
          style={{
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
