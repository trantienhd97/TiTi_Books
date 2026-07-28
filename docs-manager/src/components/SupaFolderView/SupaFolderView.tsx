import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Empty, Button } from 'antd';
import {
  DocumentText24Filled,
  ArrowLeft24Filled,
  Folder24Filled,
  ArrowRight24Filled,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { supaDocsManifest } from '../../generated/supaDocsManifest';
import './SupaFolderView.css';

const { Title, Text } = Typography;

function getDocTitle(filePath: string, folderName?: string) {
  const name = filePath.split('/').pop()?.replace('.md', '') ?? filePath;
  if (name === 'README') return folderName ?? filePath.split('/')[0] ?? name;
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
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

  const folder = useMemo(
    () => supaDocsManifest.folders.find((f) => f.id === folderId),
    [folderId],
  );

  const files = folder?.files ?? [];
  const folderName = folder?.name ?? folderId;

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

      {!folder || files.length === 0 ? (
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
              onClick={() =>
                navigate(`/supa/${folderId}/doc?file=${encodeURIComponent(file)}`)
              }
            >
              <div className="doc-card-icon">
                <DocumentText24Filled primaryFill="#60a5fa" style={{ fontSize: 22 }} />
              </div>

              <Text className="doc-card-title">{getDocTitle(file, folder.name)}</Text>
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
