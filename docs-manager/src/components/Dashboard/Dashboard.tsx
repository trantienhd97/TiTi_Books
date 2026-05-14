import { Row, Col, Button, Typography } from 'antd';
import { DocumentLink24Filled, Library24Filled, Flash24Filled, Person24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../../hooks/useTranslate';
import './Dashboard.css';

const { Title, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
  const { translate } = useTranslate();
  const navigate = useNavigate();

  const cards = [
    {
      id: 'docs',
      title: translate('dashboard.sections.docs'),
      description: translate('dashboard.cards.docs_desc'),
      icon: <Library24Filled primaryFill="#60a5fa" />,
      color: '#3b82f6',
      link: '/docs'
    },
    {
      id: 'supa',
      title: translate('dashboard.sections.supa'),
      description: translate('dashboard.cards.supa_desc'),
      icon: <Flash24Filled primaryFill="#fbbf24" />,
      color: '#f59e0b',
      link: '/supa'
    },
    {
      id: 'projects',
      title: translate('dashboard.sections.projects'),
      description: "Manage your diverse coding and research projects.",
      icon: <DocumentLink24Filled primaryFill="#34d399" />,
      color: '#10b981',
      link: '/projects'
    },
    {
      id: 'personal',
      title: translate('dashboard.sections.personal'),
      description: "Secure area for your private notes and journals.",
      icon: <Person24Filled primaryFill="#f472b6" />,
      color: '#ec4899',
      link: '/personal'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header-premium glass-card">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title className="premium-gradient-text">{translate('dashboard.title')}</Title>
            <Paragraph className="header-subtitle">{translate('dashboard.welcome')}</Paragraph>
            <Button type="primary" size="large" style={{ marginTop: 16 }}>
              Quick Start
            </Button>
          </motion.div>
        </div>
        <div className="header-image">
          <img src="/hero-bg.png" alt="Hero" />
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="cards-grid"
      >
        <Row gutter={[24, 24]}>
          {cards.map((card) => (
            <Col xs={24} sm={12} lg={6} key={card.id}>
              <motion.div variants={itemVariants} className="glass-card dashboard-card">
                <div className="card-icon-wrapper" style={{ background: `${card.color}15` }}>
                  {card.icon}
                </div>
                <Title level={4} style={{ marginTop: 16 }}>{card.title}</Title>
                <Paragraph className="card-desc">{card.description}</Paragraph>
                <div className="card-footer">
                  <Button type="primary" block onClick={() => navigate(card.link)}>
                    {translate('dashboard.cards.open')}
                  </Button>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </div>
  );
};
