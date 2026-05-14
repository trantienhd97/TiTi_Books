import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import {
  Folder24Filled,
  DataTrending24Filled,
  Play24Filled,
  Headphones24Filled,
  WifiOff24Filled,
  ClipboardSearch24Filled,
  DocumentBulletList24Filled,
  CalendarLtr24Filled,
  TaskListSquareLtr24Filled,
  DesktopPulse24Filled,
  AppsList24Filled,
  ArrowLeft24Filled,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SupaDocs.css';

const { Title, Paragraph } = Typography;

const folders = [
  { id: 'analytics',           name: 'Analytics',           icon: <DataTrending24Filled primaryFill="#60a5fa" />,  color: '#3b82f6' },
  { id: 'Animations',          name: 'Animations',           icon: <Play24Filled primaryFill="#c084fc" />,          color: '#a855f7' },
  { id: 'head_up',             name: 'Head Up',              icon: <Headphones24Filled primaryFill="#fbbf24" />,    color: '#f59e0b' },
  { id: 'inspection_offline',  name: 'Inspection Offline',   icon: <WifiOff24Filled primaryFill="#f87171" />,      color: '#ef4444' },
  { id: 'inspections',         name: 'Inspections',          icon: <ClipboardSearch24Filled primaryFill="#34d399" />, color: '#10b981' },
  { id: 'questionnair',        name: 'Questionnaire',        icon: <DocumentBulletList24Filled primaryFill="#fb923c" />, color: '#f97316' },
  { id: 'schedule',            name: 'Schedule',             icon: <CalendarLtr24Filled primaryFill="#38bdf8" />,  color: '#0ea5e9' },
  { id: 'TaskAssignment',      name: 'Task Assignment',      icon: <TaskListSquareLtr24Filled primaryFill="#a3e635" />, color: '#84cc16' },
  { id: 'training',            name: 'DesktopPulse',         icon: <DesktopPulse24Filled primaryFill="#e879f9" />, color: '#d946ef' },
  { id: 'widgets',             name: 'Widgets',              icon: <AppsList24Filled primaryFill="#67e8f9" />,     color: '#06b6d4' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const SupaDocs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="supa-docs-container">
      <div className="supa-docs-header">
        <Button
          icon={<ArrowLeft24Filled />}
          onClick={() => navigate('/')}
          className="back-btn"
        >
          Back
        </Button>
        <div>
          <Title className="premium-gradient-text" style={{ marginBottom: 4 }}>Supa Project</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Chọn một folder để xem tài liệu
          </Paragraph>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Row gutter={[24, 24]}>
          {folders.map((folder) => (
            <Col xs={12} sm={8} md={6} key={folder.id}>
              <motion.div
                variants={itemVariants}
                className="glass-card folder-card"
                onClick={() => navigate(`/supa/${folder.id}`)}
                style={{ '--accent': folder.color } as React.CSSProperties}
              >
                <div className="folder-icon" style={{ background: `${folder.color}20` }}>
                  {folder.icon}
                </div>
                <span className="folder-name">{folder.name}</span>
                <Folder24Filled className="folder-bg-icon" primaryFill={folder.color} />
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </div>
  );
};
