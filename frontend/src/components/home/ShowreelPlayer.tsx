import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { Showreel } from '@/types';
import styles from './Home.module.css';

interface Props {
  showreel: Pick<Showreel, 'id' | 'title' | 'videoUrl' | 'posterUrl'> | null;
}

export default function ShowreelPlayer({ showreel }: Props) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  if (!showreel) {
    return (
      <div className={styles.player}>
        <div className={styles.placeholder}>Showreel coming soon</div>
      </div>
    );
  }

  const start = () => {
    setPlaying(true);
    try {
      const p = ref.current?.play?.();
      if (p && typeof (p as Promise<void>).catch === 'function') (p as Promise<void>).catch(() => undefined);
    } catch {
      /* autoplay not supported */
    }
  };

  return (
    <div className={styles.player}>
      <video
        ref={ref}
        src={showreel.videoUrl}
        poster={showreel.posterUrl || undefined}
        controls={playing}
        playsInline
        data-testid="showreel-video"
      />
      {!playing && (
        <>
          <button type="button" className={styles.playBtn} onClick={start} aria-label="Play showreel">
            <Play size={30} fill="currentColor" />
          </button>
          <span className={styles.playerLabel}>{showreel.title}</span>
        </>
      )}
    </div>
  );
}