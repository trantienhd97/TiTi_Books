import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Spin, Empty } from 'antd';
import { Folder24Filled, ArrowLeft24Filled, DocumentText24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SupaDocs.css';

const { Title, Paragraph } = Typography;

type ManifestFolder = {
  id: string;
  name: string;
  files: string[];
};

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

async function loadManifest(): Promise<ManifestFolder[]> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const res = await fetch(`${base}/supa-docs/manifest.json`);
  if (!res.ok) throw new Error('manifest not found');
  const data = await res.json();
  return (data.folders ?? []) as ManifestFolder[];
}

export const SupaDocs: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<ManifestFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadManifest()
      .then((list) => { setFolders(list); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

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

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <Spin size="large" />
        </div>
      )}

      {error && !loading && (
        <Empty
          description="Không tải được danh sách docs. Chạy ./Supa/scripts/sync_docs_to_mkdocs.sh rồi build lại."
          style={{ color: 'rgba(255,255,255,0.4)', marginTop: 80 }}
        />
      )}

      {!loading && !error && folders.length === 0 && (
        <Empty
          description="Chưa có folder docs nào"
          style={{ color: 'rgba(255,255,255,0.4)', marginTop: 80 }}
        />
      )}

      {!loading && !error && folders.length > 0 && (
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
