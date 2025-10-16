import { useState } from 'react';
import { useProject } from '../../hooks/useProject';
import { ActionTypes } from '../../context/ProjectContext';
import { Button } from '../UI/Button';
import styles from './TextPanel.module.css';

const TEXT_TEMPLATES = [
  { id: 'title', name: 'Title', fontSize: 48, position: 'center' },
  { id: 'subtitle', name: 'Subtitle', fontSize: 32, position: 'center' },
  { id: 'caption', name: 'Caption', fontSize: 24, position: 'bottom-center' },
  { id: 'credit', name: 'Credit', fontSize: 18, position: 'bottom-right' },
];

export function TextPanel() {
  const { state, dispatch } = useProject();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [textContent, setTextContent] = useState('');

  const selectedClip = state.clips.find((clip) => clip.id === state.selectedClipId);

  const handleAddText = () => {
    if (!selectedClip || !textContent.trim() || !selectedTemplate) {
      return;
    }

    const template = TEXT_TEMPLATES.find((t) => t.id === selectedTemplate);

    dispatch({
      type: ActionTypes.ADD_TEXT_TO_CLIP,
      payload: {
        clipId: selectedClip.id,
        text: textContent,
        template,
      },
    });

    setTextContent('');
    setSelectedTemplate(null);
  };

  return (
    <div className={styles.textPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Text & Titles</h3>
      </div>

      {!selectedClip ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p className={styles.emptyText}>No clip selected</p>
          <p className={styles.emptySubtext}>Select a clip to add text</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>Text Templates</label>
            <div className={styles.templatesGrid}>
              {TEXT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={`${styles.templateButton} ${
                    selectedTemplate === template.id ? styles.templateButtonSelected : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="textInput">
              Text Content
            </label>
            <textarea
              id="textInput"
              className={styles.textarea}
              placeholder="Enter your text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.section}>
            <Button
              variant="primary"
              onClick={handleAddText}
              disabled={!textContent.trim() || !selectedTemplate}
              className={styles.addButton}
            >
              Add Text to Clip
            </Button>
          </div>

          {selectedClip.texts && selectedClip.texts.length > 0 && (
            <div className={styles.section}>
              <label className={styles.label}>Current Texts ({selectedClip.texts.length})</label>
              <div className={styles.textsList}>
                {selectedClip.texts.map((text) => (
                  <div key={text.id} className={styles.textItem}>
                    <p className={styles.textContent}>{text.content}</p>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        dispatch({
                          type: ActionTypes.REMOVE_TEXT,
                          payload: { clipId: selectedClip.id, textId: text.id },
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
