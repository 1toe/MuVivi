import { useRef, useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { MediaActionTypes } from '../../context/MediaContext';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import styles from './MediaPanel.module.css';

export function MediaPanel() {
  const { state, dispatch } = useMedia();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleDrop, handleFileInput, isUploading, uploadProgress } = useMediaUpload();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDropEvent = async (e) => {
    setIsDragging(false);
    await handleDrop(e);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    await handleFileInput(e);
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const handleDeleteMedia = (mediaId) => {
    dispatch({
      type: MediaActionTypes.DELETE_MEDIA,
      payload: mediaId,
    });
  };

  const handleSelectMedia = (mediaId) => {
    dispatch({
      type: MediaActionTypes.SET_SELECTED_MEDIA,
      payload: mediaId,
    });
  };

  const handleMediaDragStart = (e, mediaItem) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('mediaId', mediaItem.id);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className={styles.mediaPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Media Library</h2>
        <button className={styles.addButton} onClick={handleClick} disabled={isUploading}>
          + Add Media
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,image/*,audio/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div
        className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className={styles.uploadingState}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className={styles.uploadingText}>Uploading... {uploadProgress}%</p>
          </div>
        ) : state.media.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <p className={styles.emptyText}>No media imported yet</p>
            <p className={styles.emptySubtext}>Drag & drop files here or click to import</p>
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {state.media.map((item) => (
              <div
                key={item.id}
                className={`${styles.mediaItem} ${
                  state.selectedMediaId === item.id ? styles.mediaItemSelected : ''
                }`}
                onClick={() => handleSelectMedia(item.id)}
                draggable
                onDragStart={(e) => handleMediaDragStart(e, item)}
              >
                <div className={styles.thumbnail}>
                  <img src={item.thumbnail} alt={item.name} />
                  {item.type === 'video' && (
                    <div className={styles.durationBadge}>{formatDuration(item.duration)}</div>
                  )}
                </div>
                <div className={styles.mediaInfo}>
                  <p className={styles.mediaName} title={item.name}>
                    {item.name}
                  </p>
                  <p className={styles.mediaDetails}>
                    {item.type === 'video' && `${item.width}x${item.height} • `}
                    {formatFileSize(item.size)}
                  </p>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMedia(item.id);
                  }}
                  aria-label="Delete media"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
