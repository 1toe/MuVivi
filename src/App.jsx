import { ProjectProvider } from './context/ProjectContext';
import { MediaProvider } from './context/MediaContext';
import { MainLayout } from './components/Layout/MainLayout';
import './styles/theme.css';
import './styles/animations.css';
import './styles/reset.css';

function App() {
  return (
    <ProjectProvider>
      <MediaProvider>
        <MainLayout />
      </MediaProvider>
    </ProjectProvider>
  );
}

export default App;
