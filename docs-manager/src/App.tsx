import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SupaDocs } from './components/SupaDocs/SupaDocs';
import { SupaFolderView } from './components/SupaFolderView/SupaFolderView';
import { DocViewer } from './components/DocViewer/DocViewer';
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
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout style={{ marginLeft: 260 }}>
            <Content>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/supa" element={<SupaDocs />} />
                <Route path="/supa/:folderId" element={<SupaFolderView />} />
                <Route path="/supa/:folderId/doc" element={<DocViewer />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
