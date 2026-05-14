import { Layout, ConfigProvider, theme } from 'antd';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 260 }}>
          <Content>
            <Dashboard />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
