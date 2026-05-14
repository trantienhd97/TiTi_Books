import React from 'react';
import { Layout, Menu } from 'antd';
import { Home24Filled, DocumentText24Filled, Settings24Filled, BookDatabase24Filled } from '@fluentui/react-icons';
import { useTranslate } from '../../hooks/useTranslate';
import './Sidebar.css';

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const { translate } = useTranslate();

  return (
    <Sider width={260} className="app-sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <BookDatabase24Filled primaryFill="#60a5fa" />
        </div>
        <span className="logo-text premium-gradient-text">TiTi Books</span>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <Home24Filled />,
            label: translate('sidebar.home'),
          },
          {
            key: '2',
            icon: <DocumentText24Filled />,
            label: translate('sidebar.all_docs'),
          },
          {
            key: '3',
            icon: <Settings24Filled />,
            label: translate('sidebar.settings'),
          },
        ]}
      />
    </Sider>
  );
};
