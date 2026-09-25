import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';
import type { Showreel } from '@/types';
import styles from './ShowreelList.module.css';

type ShowreelItem = Pick<Showreel, 'id' | 'title' | 'videoUrl'> & { posterUrl?: string | null };

interface Props {
  showreel: ShowreelItem;
}

export default function ShowreelList({ showreel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!playing) {
      setPlaying(true);
      if (v && typeof v.play === 'function') {
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => setPlaying(false));
      }
    } else {
      setPlaying(false);
      if (v && typeof v.pause === 'function') v.pause();
    }
  };

  const toggleMute = () => {
    setMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  };

  return (
    <div className={styles.card} data-testid="showreel-item">
      <div className={styles.player}>
        <video
          ref={videoRef}
          className={styles.video}
          src={showreel.videoUrl}
          poster={showreel.posterUrl || undefined}
          muted={muted}
          playsInline
          loop
          aria-label={showreel.title}
        />
        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={togglePlay} aria-label={playing ? 'Pause showreel' : 'Play showreel'}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button type="button" className={styles.btn} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
      <div className={styles.meta}>
        <Film size={18} />
        <h2 className={styles.title}>{showreel.title}</h2>
      </div>
    </div>
  );
}