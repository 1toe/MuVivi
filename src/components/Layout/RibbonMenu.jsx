import { useState } from 'react';
import { ExportModal } from '../Export/ExportModal';
import styles from './RibbonMenu.module.css';

const TABS = [
  {
    id: 'inicio',
    label: 'Inicio',
    sections: [
      {
        title: 'Proyecto',
        actions: [
          { id: 'new', label: 'Nuevo', icon: '📄' },
          { id: 'open', label: 'Abrir', icon: '📂' },
          { id: 'save', label: 'Guardar', icon: '💾' },
        ],
      },
      {
        title: 'Edición',
        actions: [
          { id: 'cut', label: 'Cortar', icon: '✂️' },
          { id: 'copy', label: 'Copiar', icon: '📋' },
          { id: 'paste', label: 'Pegar', icon: '📌' },
        ],
      },
      {
        title: 'Exportar',
        actions: [{ id: 'export', label: 'Exportar Video', icon: '🎬' }],
      },
    ],
  },
  {
    id: 'animaciones',
    label: 'Animaciones',
    sections: [
      {
        title: 'Transiciones',
        actions: [
          { id: 'fade', label: 'Fade', icon: '▓' },
          { id: 'dissolve', label: 'Dissolve', icon: '◐' },
          { id: 'wipe', label: 'Wipe', icon: '▶' },
          { id: 'slide', label: 'Slide', icon: '→' },
        ],
      },
    ],
  },
  {
    id: 'efectos',
    label: 'Efectos Visuales',
    sections: [
      {
        title: 'Efectos',
        actions: [
          { id: 'brightness', label: 'Brillo', icon: '☀️' },
          { id: 'contrast', label: 'Contraste', icon: '◐' },
          { id: 'blur', label: 'Blur', icon: '🌫️' },
          { id: 'sepia', label: 'Sepia', icon: '🟤' },
        ],
      },
    ],
  },
  {
    id: 'insertar',
    label: 'Insertar',
    sections: [
      {
        title: 'Texto',
        actions: [
          { id: 'title', label: 'Título', icon: '📝' },
          { id: 'caption', label: 'Subtítulo', icon: '💬' },
        ],
      },
      {
        title: 'Audio',
        actions: [{ id: 'music', label: 'Música', icon: '🎵' }],
      },
    ],
  },
];

export function RibbonMenu({ activeTab, onTabChange }) {
  const [expandedTab, setExpandedTab] = useState(activeTab);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleTabClick = (tabId) => {
    setExpandedTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleActionClick = (actionId) => {
    if (actionId === 'export') {
      setShowExportModal(true);
    }
    // TODO: Implement other actions (new, open, save, etc.)
  };

  const activeTabData = TABS.find((tab) => tab.id === expandedTab);

  return (
    <div className={styles.ribbonMenu}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${expandedTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ribbon Content */}
      <div className={styles.ribbonContent}>
        {activeTabData?.sections.map((section, index) => (
          <div key={index} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <div className={styles.actions}>
              {section.actions.map((action) => (
                <button
                  key={action.id}
                  className={styles.actionButton}
                  title={action.label}
                  onClick={() => handleActionClick(action.id)}
                >
                  <span className={styles.actionIcon}>{action.icon}</span>
                  <span className={styles.actionLabel}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  );
}
