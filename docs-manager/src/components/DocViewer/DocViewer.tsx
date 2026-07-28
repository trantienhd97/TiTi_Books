import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import './DocViewer.css';

const { Text } = Typography;

export const DocViewer: React.FC = () => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const [searchParams] = useSearchParams();
  const file = searchParams.get('file') ?? undefined;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const url = `${base}/supa-docs/${file}?t=${Date.now()}`;
    fetch(url, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [file]);

  return (
    <div className="doc-viewer-container">
      <div className="doc-viewer-header">
        <Button
          icon={<ArrowLeft24Filled />}
          onClick={() => navigate(`/supa/${folderId}`)}
          className="back-btn"
        >
          {folderId}
        </Button>
        {file && (
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 13 }}>
            {file}
          </Text>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <Spin size="large" />
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', marginTop: 80, color: 'rgba(255,255,255,0.4)' }}>
          Không tìm thấy tài liệu này.
        </div>
      )}

      {!loading && !error && (
        <motion.div
          className="glass-card markdown-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </motion.div>
      )}
    </div>
  );
};
