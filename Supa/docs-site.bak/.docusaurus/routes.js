import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '597'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'b07'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '912'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '3e9'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'a28'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'ad2'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '454'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'db9'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'a8c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/ai-workflow-image-compression',
        component: ComponentCreator('/docs/ai-workflow-image-compression', 'dfe'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analytics_permissions_docs',
        component: ComponentCreator('/docs/analytics_permissions_docs', '678'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analytics/',
        component: ComponentCreator('/docs/analytics/', 'aa3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analytics/learning_overview_summary_by_site',
        component: ComponentCreator('/docs/analytics/learning_overview_summary_by_site', 'f80'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analytics/site_report_api_docs',
        component: ComponentCreator('/docs/analytics/site_report_api_docs', 'f52'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/android-16kb-support',
        component: ComponentCreator('/docs/android-16kb-support', 'd28'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Animations/celebration-animation',
        component: ComponentCreator('/docs/Animations/celebration-animation', '79a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Animations/streak-animation',
        component: ComponentCreator('/docs/Animations/streak-animation', '51a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cau-truc-du-an-va-huong-dan',
        component: ComponentCreator('/docs/cau-truc-du-an-va-huong-dan', '513'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/CHANGELOG_QUICK_REF',
        component: ComponentCreator('/docs/CHANGELOG_QUICK_REF', '677'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/CHANGELOG_SUMMARY',
        component: ComponentCreator('/docs/CHANGELOG_SUMMARY', '513'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/core-packages',
        component: ComponentCreator('/docs/core-packages', '0b2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/dependency-injection',
        component: ComponentCreator('/docs/dependency-injection', '9fb'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/deployment',
        component: ComponentCreator('/docs/deployment', 'aee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/discussion-entity-adapters',
        component: ComponentCreator('/docs/discussion-entity-adapters', '546'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/entity-chat-integration-guide',
        component: ComponentCreator('/docs/entity-chat-integration-guide', '52a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/ga4-analytics-guide',
        component: ComponentCreator('/docs/ga4-analytics-guide', 'aac'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gitnexus-usage',
        component: ComponentCreator('/docs/gitnexus-usage', '743'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/head_up/create_announcement_feature',
        component: ComponentCreator('/docs/head_up/create_announcement_feature', '451'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/',
        component: ComponentCreator('/docs/inspection_offline/', '7a2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/client_side/bieu_mau',
        component: ComponentCreator('/docs/inspection_offline/client_side/bieu_mau', 'a94'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/client_side/INSPECTION_CALCULATE_SCORE_CLIENT_GUIDE',
        component: ComponentCreator('/docs/inspection_offline/client_side/INSPECTION_CALCULATE_SCORE_CLIENT_GUIDE', 'abc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/client_side/INSPECTION_CLIENT_VALIDATION_GUIDE',
        component: ComponentCreator('/docs/inspection_offline/client_side/INSPECTION_CLIENT_VALIDATION_GUIDE', '6b2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/client_side/score',
        component: ComponentCreator('/docs/inspection_offline/client_side/score', 'eb4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/INSPECTION_LOGIC_QUICK_REF',
        component: ComponentCreator('/docs/inspection_offline/INSPECTION_LOGIC_QUICK_REF', 'bf8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/INSPECTION_LOGIC_SYSTEM',
        component: ComponentCreator('/docs/inspection_offline/INSPECTION_LOGIC_SYSTEM', 'be4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/INSPECTION_OFFLINE_ANALYSIS',
        component: ComponentCreator('/docs/inspection_offline/INSPECTION_OFFLINE_ANALYSIS', 'd51'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/INSPECTION_OFFLINE_SUMMARY',
        component: ComponentCreator('/docs/inspection_offline/INSPECTION_OFFLINE_SUMMARY', '391'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspection_offline/TASK_ASSIGNMENT_TRIGGER_ANALYSIS',
        component: ComponentCreator('/docs/inspection_offline/TASK_ASSIGNMENT_TRIGGER_ANALYSIS', '9e1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspections/',
        component: ComponentCreator('/docs/inspections/', 'a92'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspections/answer-types-system',
        component: ComponentCreator('/docs/inspections/answer-types-system', '090'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspections/architecture-overview',
        component: ComponentCreator('/docs/inspections/architecture-overview', 'dd7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/inspections/upload-progress-implementation',
        component: ComponentCreator('/docs/inspections/upload-progress-implementation', '66e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/localization',
        component: ComponentCreator('/docs/localization', '501'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/media_picker_plus_integration',
        component: ComponentCreator('/docs/media_picker_plus_integration', 'a73'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/multi_selection_search_modal_usage',
        component: ComponentCreator('/docs/multi_selection_search_modal_usage', 'a74'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/notification-handlers',
        component: ComponentCreator('/docs/notification-handlers', '184'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/push_notification_lifecycle',
        component: ComponentCreator('/docs/push_notification_lifecycle', 'f52'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/questionnair/ai_gennerate',
        component: ComponentCreator('/docs/questionnair/ai_gennerate', '9e0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/RELEASE_NOTES_GUIDE',
        component: ComponentCreator('/docs/RELEASE_NOTES_GUIDE', 'aee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/ROUTE_MIGRATION_GUIDE',
        component: ComponentCreator('/docs/ROUTE_MIGRATION_GUIDE', '8d4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/schedule/dat-lich',
        component: ComponentCreator('/docs/schedule/dat-lich', '195'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/schedule/schedule_creation_form',
        component: ComponentCreator('/docs/schedule/schedule_creation_form', 'bfb'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/search_tab_usage',
        component: ComponentCreator('/docs/search_tab_usage', '72a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/STREAM_CHAT_LOCALIZATION',
        component: ComponentCreator('/docs/STREAM_CHAT_LOCALIZATION', '5e7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/styling-rules',
        component: ComponentCreator('/docs/styling-rules', '324'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sub-app-development',
        component: ComponentCreator('/docs/sub-app-development', 'ead'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/supa_bibs_push_notification_subscription_points',
        component: ComponentCreator('/docs/supa_bibs_push_notification_subscription_points', '4b7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/supa_communication_chat',
        component: ComponentCreator('/docs/supa_communication_chat', '53e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/supa_communication_integration',
        component: ComponentCreator('/docs/supa_communication_integration', 'e96'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/TaskAssignment/quick-status-change-implementation',
        component: ComponentCreator('/docs/TaskAssignment/quick-status-change-implementation', '8c7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/TaskAssignment/task-assignment-status-change-flow',
        component: ComponentCreator('/docs/TaskAssignment/task-assignment-status-change-flow', '3b4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/TaskAssignment/trang-home',
        component: ComponentCreator('/docs/TaskAssignment/trang-home', 'a31'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/TaskAssignment/visibility-and-filtering-logic',
        component: ComponentCreator('/docs/TaskAssignment/visibility-and-filtering-logic', '2a8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/training/filter_sync_personal_report',
        component: ComponentCreator('/docs/training/filter_sync_personal_report', '8e0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/training/location_answer_implementation',
        component: ComponentCreator('/docs/training/location_answer_implementation', '429'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/training/personal_report_default_filter',
        component: ComponentCreator('/docs/training/personal_report_default_filter', 'ccf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/ui-components',
        component: ComponentCreator('/docs/ui-components', '629'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/',
        component: ComponentCreator('/docs/widgets/', '6f8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/dashboard/dashboard_frame',
        component: ComponentCreator('/docs/widgets/dashboard/dashboard_frame', '30e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_attendance_widgets',
        component: ComponentCreator('/docs/widgets/supa_attendance_widgets', '354'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_bibs_widgets',
        component: ComponentCreator('/docs/widgets/supa_bibs_widgets', '3c2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_serving_widgets',
        component: ComponentCreator('/docs/widgets/supa_serving_widgets', '946'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_spend_widgets',
        component: ComponentCreator('/docs/widgets/supa_spend_widgets', 'f27'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_training_widgets',
        component: ComponentCreator('/docs/widgets/supa_training_widgets', '80c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/supa_work_widgets',
        component: ComponentCreator('/docs/widgets/supa_work_widgets', 'a9f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/video_streaming_screen',
        component: ComponentCreator('/docs/widgets/video_streaming_screen', '206'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/work/inspection/checklist_item',
        component: ComponentCreator('/docs/widgets/work/inspection/checklist_item', '673'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/widgets/work/task_assignment/task_item',
        component: ComponentCreator('/docs/widgets/work/task_assignment/task_item', 'dc4'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '45a'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
