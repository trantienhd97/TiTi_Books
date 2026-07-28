import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Empty, Button } from 'antd';
import {
  DocumentText24Filled,
  ArrowLeft24Filled,
  Folder24Filled,
  ArrowRight24Filled,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import './SupaFolderView.css';

const { Title, Text } = Typography;

const FOLDER_META: Record<string, { name: string; files: string[] }> = {
  'cua-toi': {
    name: 'Của tôi',
    files: ['cua-toi/README.md'],
  },
  'dang-ky-tai-khoan': {
    name: 'Đăng ký tài khoản',
    files: ['dang-ky-tai-khoan/README.md'],
  },
  'hoc-khoa-hoc': {
    name: 'Học khoá học',
    files: ['hoc-khoa-hoc/README.md'],
  },
  'ho-so-nguoi-dung': {
    name: 'Hồ sơ người dùng',
    files: ['ho-so-nguoi-dung/README.md'],
  },
  'task-progress-report': {
    name: 'Báo cáo tiến độ công việc',
    files: ['task-progress-report/README.md'],
  },
  'tin-nhan': {
    name: 'Tin nhắn',
    files: ['tin-nhan/README.md'],
  },
  checklist: {
    name: 'Checklist',
    files: ['checklist/README.md'],
  },
  'chi-tiet-checklist': {
    name: 'Chi tiết checklist',
    files: ['chi-tiet-checklist/README.md'],
  },
  'tra-loi-checklist': {
    name: 'Trả lời checklist',
    files: ['tra-loi-checklist/README.md'],
  },
  'tra-loi-checklist-offline': {
    name: 'Trả lời checklist offline',
    files: ['tra-loi-checklist-offline/README.md'],
  },
  'cong-viec': {
    name: 'Công việc',
    files: ['cong-viec/README.md'],
  },
  'chi-tiet-cong-viec': {
    name: 'Chi tiết công việc',
    files: ['chi-tiet-cong-viec/README.md'],
  },
  'tro-ly-ai': {
    name: 'Trợ lý AI (SuSu)',
    files: ['tro-ly-ai/README.md'],
  },
  'automated-ui-testing': {
    name: 'Automated UI Testing',
    files: [
      'automated-ui-testing/README.md',
      'automated-ui-testing/test_case_ba_template.md',
    ],
  },
};

function getDocTitle(filePath: string) {
  const name = filePath.split('/').pop()?.replace('.md', '') ?? filePath;
  if (name === 'README') {
    const folder = filePath.split('/')[0] ?? name;
    return FOLDER_META[folder]?.name ?? folder;
  }
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const SupaFolderView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const meta = folderId ? FOLDER_META[folderId] : undefined;
  const files = meta?.files ?? [];
  const folderName = meta?.name ?? folderId;

  return (
    <div className="folder-view-container">
      <div className="folder-view-header">
        <Button
          icon={<ArrowLeft24Filled />}
          onClick={() => navigate('/supa')}
          className="back-btn"
        >
          Supa
        </Button>
        <div>
          <Title
            className="premium-gradient-text"
            style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Folder24Filled style={{ fontSize: 28 }} />
            {folderName}
          </Title>
          <span className="folder-badge">
            <DocumentText24Filled style={{ fontSize: 14 }} />
            {files.length} tài liệu
          </span>
        </div>
      </div>

      {files.length === 0 ? (
        <Empty
          description="Không có tài liệu nào"
          style={{ color: 'rgba(255,255,255,0.4)', marginTop: 80 }}
        />
      ) : (
        <motion.div
          className="doc-cards-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {files.map((file, index) => (
            <motion.div
              key={file}
              variants={itemVariants}
              className="doc-card"
              onClick={() => navigate(`/supa/${folderId}/doc`, { state: { file } })}
            >
              <div className="doc-card-icon">
                <DocumentText24Filled primaryFill="#60a5fa" style={{ fontSize: 22 }} />
              </div>

              <Text className="doc-card-title">{getDocTitle(file)}</Text>
              <Text className="doc-card-path">{file}</Text>

              <ArrowRight24Filled
                className="doc-card-arrow"
                primaryFill="rgba(96,165,250,0.6)"
                style={{ fontSize: 18 }}
              />
              <span className="doc-card-number">{String(index + 1).padStart(2, '0')}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
