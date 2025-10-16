import { useState } from 'react';
import { RibbonMenu } from './RibbonMenu';
import { MediaPanel } from '../Panels/MediaPanel';
import { Player } from '../Editor/Player';
import { Storyboard } from '../Editor/Storyboard';
import { PropertiesPanel } from '../Panels/PropertiesPanel';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div className={styles.mainLayout}>
      {/* Ribbon Menu */}
      <RibbonMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* Left Sidebar - Media Panel */}
        <aside className={styles.leftSidebar}>
          <MediaPanel />
        </aside>

        {/* Center - Editor Area */}
        <main className={styles.editorArea}>
          {/* Player Preview */}
          <div className={styles.playerSection}>
            <Player />
          </div>

          {/* Storyboard Timeline */}
          <div className={styles.storyboardSection}>
            <Storyboard />
          </div>
        </main>

        {/* Right Sidebar - Properties Panel */}
        <aside className={styles.rightSidebar}>
          <PropertiesPanel activeRibbonTab={activeTab} />
        </aside>
      </div>
    </div>
  );
}
