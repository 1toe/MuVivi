import { ProjectProvider } from './context/ProjectContext';
import { MediaProvider } from './context/MediaContext';
import { MainLayout } from './components/Layout/MainLayout';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './styles/theme.css';
import './styles/animations.css';
import './styles/reset.css';

function AppContent() {
  // Auto-save every 30 seconds
  useAutoSave(30000);
  
  // Keyboard shortcuts
  useKeyboardShortcuts();
  
  return <MainLayout />;
}

function App() {
  return (
    <ProjectProvider>
      <MediaProvider>
        <AppContent />
      </MediaProvider>
    </ProjectProvider>
  );
}

export default App;
