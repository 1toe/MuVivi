import { useState, useRef } from 'react';
import { useProject } from '../../hooks/useProject';
import { ActionTypes } from '../../context/ProjectContext';
import { useMedia } from '../../context/MediaContext';
import { Clip } from './Clip';
import styles from './Storyboard.module.css';

export function Storyboard() {
  const { state, dispatch } = useProject();
  const { state: mediaState } = useMedia();
  const [draggedClipIndex, setDraggedClipIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const timelineRef = useRef(null);

  // Handle drag from media library
  const handleMediaDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleMediaDrop = (e) => {
    e.preventDefault();
    const mediaId = e.dataTransfer.getData('mediaId');
    
    if (mediaId) {
      const mediaItem = mediaState.media.find((item) => item.id === mediaId);
      
      if (mediaItem) {
        dispatch({
          type: ActionTypes.ADD_CLIP,
          payload: {
            type: mediaItem.type,
            name: mediaItem.name,
            url: mediaItem.url,
            thumbnail: mediaItem.thumbnail,
            duration: mediaItem.duration,
            width: mediaItem.width,
            height: mediaItem.height,
          },
        });
      }
    }
  };

  // Handle clip reorder
  const handleClipDragStart = (index) => {
    setDraggedClipIndex(index);
  };

  const handleClipDragEnd = () => {
    setDraggedClipIndex(null);
    setDragOverIndex(null);
  };

  const handleClipDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedClipIndex === null) return;
    if (index === draggedClipIndex) return;
    
    setDragOverIndex(index);
  };

  const handleClipDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedClipIndex === null) return;
    
    const newClips = [...state.clips];
    const [draggedClip] = newClips.splice(draggedClipIndex, 1);
    newClips.splice(dropIndex, 0, draggedClip);
    
    dispatch({
      type: ActionTypes.REORDER_CLIPS,
      payload: newClips,
    });
    
    setDraggedClipIndex(null);
    setDragOverIndex(null);
  };

  const handleSelectClip = (clipId) => {
    dispatch({
      type: ActionTypes.SET_SELECTED_CLIP,
      payload: clipId,
    });
  };

  const handleDeleteClip = (clipId) => {
    dispatch({
      type: ActionTypes.DELETE_CLIP,
      payload: clipId,
    });
  };

  const formatTotalDuration = () => {
    const totalSeconds = state.clips.reduce((acc, clip) => acc + (clip.duration || 0), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.storyboard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Timeline</h3>
        <div className={styles.info}>
          <span className={styles.clipCount}>{state.clips.length} clip(s)</span>
          <span className={styles.totalDuration}>Duration: {formatTotalDuration()}</span>
        </div>
      </div>

      <div
        ref={timelineRef}
        className={styles.timeline}
        onDragOver={handleMediaDragOver}
        onDrop={handleMediaDrop}
      >
        {state.clips.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎬</div>
            <p className={styles.emptyText}>Timeline is empty</p>
            <p className={styles.emptySubtext}>Drag media from library to start editing</p>
          </div>
        ) : (
          <div className={styles.clipsContainer}>
            {state.clips.map((clip, index) => (
              <div
                key={clip.id}
                className={`${styles.clipWrapper} ${
                  dragOverIndex === index ? styles.clipWrapperDragOver : ''
                }`}
                onDragOver={(e) => handleClipDragOver(e, index)}
                onDrop={(e) => handleClipDrop(e, index)}
              >
                <Clip
                  clip={clip}
                  index={index}
                  isSelected={state.selectedClipId === clip.id}
                  onSelect={handleSelectClip}
                  onDelete={handleDeleteClip}
                  onDragStart={handleClipDragStart}
                  onDragEnd={handleClipDragEnd}
                />
                {index < state.clips.length - 1 && (
                  <div className={styles.clipSeparator}>→</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
