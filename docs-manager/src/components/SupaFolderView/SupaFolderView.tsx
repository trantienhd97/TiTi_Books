import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, Typography, Empty, Button } from 'antd';
import { DocumentText24Filled, ArrowLeft24Filled, Folder24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import './SupaFolderView.css';
import './../../index.css';

const { Title, Text } = Typography;

// Map folder -> list of md files (relative path from /supa-docs/)
const FOLDER_FILES: Record<string, string[]> = {
  analytics: [
    'analytics/README.md',
    'analytics/learning_overview_summary_by_site.md',
    'analytics/site_report_api_docs.md',
  ],
  Animations: [
    'Animations/celebration-animation.md',
    'Animations/streak-animation.md',
  ],
  head_up: [
    'head_up/create_announcement_feature.md',
  ],
  inspection_offline: [
    'inspection_offline/README.md',
    'inspection_offline/INSPECTION_LOGIC_QUICK_REF.md',
    'inspection_offline/INSPECTION_LOGIC_SYSTEM.md',
    'inspection_offline/INSPECTION_OFFLINE_ANALYSIS.md',
    'inspection_offline/INSPECTION_OFFLINE_SUMMARY.md',
    'inspection_offline/TASK_ASSIGNMENT_TRIGGER_ANALYSIS.md',
    'inspection_offline/client_side/bieu_mau.md',
    'inspection_offline/client_side/INSPECTION_CALCULATE_SCORE_CLIENT_GUIDE.md',
    'inspection_offline/client_side/INSPECTION_CLIENT_VALIDATION_GUIDE.md',
    'inspection_offline/client_side/score.md',
  ],
  inspections: [
    'inspections/README.md',
    'inspections/answer-types-system.md',
    'inspections/architecture-overview.md',
    'inspections/upload-progress-implementation.md',
  ],
  questionnair: [
    'questionnair/ai_gennerate.md',
  ],
  schedule: [
    'schedule/dat-lich.md',
    'schedule/schedule_creation_form.md',
  ],
  TaskAssignment: [
    'TaskAssignment/quick-status-change-implementation.md',
    'TaskAssignment/task-assignment-status-change-flow.md',
    'TaskAssignment/trang-home.md',
    'TaskAssignment/visibility-and-filtering-logic.md',
  ],
  training: [
    'training/filter_sync_personal_report.md',
    'training/location_answer_implementation.md',
    'training/personal_report_default_filter.md',
  ],
  widgets: [
    'widgets/index.md',
    'widgets/supa_attendance_widgets.md',
    'widgets/supa_bibs_widgets.md',
    'widgets/supa_serving_widgets.md',
    'widgets/supa_spend_widgets.md',
    'widgets/supa_training_widgets.md',
    'widgets/supa_work_widgets.md',
    'widgets/video_streaming_screen.md',
    'widgets/dashboard/dashboard_frame.md',
    'widgets/work/inspection/checklist_item.md',
    'widgets/work/task_assignment/task_item.md',
  ],
};

function getDocTitle(filePath: string) {
  const name = filePath.split('/').pop()?.replace('.md', '') ?? filePath;
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export const SupaFolderView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();


  const files = folderId ? (FOLDER_FILES[folderId] ?? []) : [];

  return (
    <div className="folder-view-container">
      <div className="folder-view-header">
        <Button icon={<ArrowLeft24Filled />} onClick={() => navigate('/supa')} className="back-btn">
          Supa
        </Button>
        <div>
          <Title className="premium-gradient-text" style={{ marginBottom: 0 }}>
            <Folder24Filled style={{ marginRight: 10, verticalAlign: 'middle' }} />
            {folderId}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.4)' }}>{files.length} tài liệu</Text>
        </div>
      </div>

      {files.length === 0 ? (
        <Empty description="Không có tài liệu nào" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 80 }} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <List
            className="doc-list"
            dataSource={files}
            renderItem={(file, index) => (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <List.Item
                  className="doc-list-item glass-card"
                  onClick={() => navigate(`/supa/${folderId}/doc`, { state: { file } })}
                >
                  <DocumentText24Filled primaryFill="#60a5fa" className="doc-icon" />
                  <span className="doc-title">{getDocTitle(file)}</span>
                  <Text className="doc-path">{file}</Text>
                </List.Item>
              </motion.div>
            )}
          />
        </motion.div>
      )}
    </div>
  );
};
