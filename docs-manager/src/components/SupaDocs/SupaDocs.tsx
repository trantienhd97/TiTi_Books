import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import {
  Folder24Filled,
  Home24Filled,
  PersonAccounts24Filled,
  LearningApp24Filled,
  Person24Filled,
  DataTrending24Filled,
  Chat24Filled,
  ClipboardSearch24Filled,
  ClipboardTask24Filled,
  DocumentEdit24Filled,
  WifiOff24Filled,
  TaskListSquareLtr24Filled,
  DocumentBulletList24Filled,
  Bot24Filled,
  Beaker24Filled,
  ArrowLeft24Filled,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SupaDocs.css';

const { Title, Paragraph } = Typography;

const folders = [
  { id: 'cua-toi', name: 'Của tôi', icon: <Home24Filled primaryFill="#60a5fa" />, color: '#3b82f6' },
  { id: 'dang-ky-tai-khoan', name: 'Đăng ký tài khoản', icon: <PersonAccounts24Filled primaryFill="#c084fc" />, color: '#a855f7' },
  { id: 'hoc-khoa-hoc', name: 'Học khoá học', icon: <LearningApp24Filled primaryFill="#fbbf24" />, color: '#f59e0b' },
  { id: 'ho-so-nguoi-dung', name: 'Hồ sơ người dùng', icon: <Person24Filled primaryFill="#f472b6" />, color: '#ec4899' },
  { id: 'task-progress-report', name: 'Báo cáo tiến độ', icon: <DataTrending24Filled primaryFill="#34d399" />, color: '#10b981' },
  { id: 'tin-nhan', name: 'Tin nhắn', icon: <Chat24Filled primaryFill="#38bdf8" />, color: '#0ea5e9' },
  { id: 'checklist', name: 'Checklist', icon: <ClipboardSearch24Filled primaryFill="#a3e635" />, color: '#84cc16' },
  { id: 'chi-tiet-checklist', name: 'Chi tiết checklist', icon: <ClipboardTask24Filled primaryFill="#fb923c" />, color: '#f97316' },
  { id: 'tra-loi-checklist', name: 'Trả lời checklist', icon: <DocumentEdit24Filled primaryFill="#67e8f9" />, color: '#06b6d4' },
  { id: 'tra-loi-checklist-offline', name: 'Checklist offline', icon: <WifiOff24Filled primaryFill="#f87171" />, color: '#ef4444' },
  { id: 'cong-viec', name: 'Công việc', icon: <TaskListSquareLtr24Filled primaryFill="#e879f9" />, color: '#d946ef' },
  { id: 'chi-tiet-cong-viec', name: 'Chi tiết công việc', icon: <DocumentBulletList24Filled primaryFill="#818cf8" />, color: '#6366f1' },
  { id: 'tro-ly-ai', name: 'Trợ lý AI (SuSu)', icon: <Bot24Filled primaryFill="#2dd4bf" />, color: '#14b8a6' },
  { id: 'automated-ui-testing', name: 'Automated UI Testing', icon: <Beaker24Filled primaryFill="#94a3b8" />, color: '#64748b' },
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
            Chọn một màn hình để xem tài liệu
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
