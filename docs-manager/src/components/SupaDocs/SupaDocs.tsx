import React from 'react';
import { Row, Col, Typography, Button, Empty } from 'antd';
import { Folder24Filled, ArrowLeft24Filled, DocumentText24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supaDocsManifest } from '../../generated/supaDocsManifest';
import './SupaDocs.css';

const { Title, Paragraph } = Typography;

const COLORS = [
  '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#10b981', '#0ea5e9',
  '#84cc16', '#f97316', '#06b6d4', '#ef4444', '#d946ef', '#6366f1',
  '#14b8a6', '#64748b',
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
  const folders = supaDocsManifest.folders;

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

      {folders.length === 0 ? (
        <Empty
          description="Chưa có folder docs. Chạy ./Supa/scripts/sync_docs_to_mkdocs.sh"
          style={{ color: 'rgba(255,255,255,0.4)', marginTop: 80 }}
        />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Row gutter={[24, 24]}>
            {folders.map((folder, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <Col xs={12} sm={8} md={6} key={folder.id}>
                  <motion.div
                    variants={itemVariants}
                    className="glass-card folder-card"
                    onClick={() => navigate(`/supa/${folder.id}`)}
                    style={{ '--accent': color } as React.CSSProperties}
                  >
                    <div className="folder-icon" style={{ background: `${color}20` }}>
                      <DocumentText24Filled primaryFill={color} />
                    </div>
                    <span className="folder-name">{folder.name}</span>
                    <Folder24Filled className="folder-bg-icon" primaryFill={color} />
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </motion.div>
      )}
    </div>
  );
};
