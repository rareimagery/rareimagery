import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
  error: string | null;
}

interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

export function useAudioPlayer(
  url: string | null,
  options: { loop?: boolean; volume?: number } = {},
): AudioPlayerState & AudioPlayerControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: (options.volume ?? 80) / 100,
    isLoaded: false,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    const audio = new Audio(url);
    audio.loop = options.loop ?? true;
    audio.volume = state.volume;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setState((s) => ({ ...s, duration: audio.duration, isLoaded: true }));
    };
    const onTimeUpdate = () => {
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    };
    const onEnded = () => {
      setState((s) => ({ ...s, isPlaying: false }));
    };
    const onError = () => {
      setState((s) => ({ ...s, error: 'Failed to load audio', isLoaded: false }));
    };
    const onPlay = () => {
      setState((s) => ({ ...s, isPlaying: true }));
    };
    const onPause = () => {
      setState((s) => ({ ...s, isPlaying: false }));
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.src = '';
      audioRef.current = null;
    };
  }, [url, options.loop]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {
      setState((s) => ({ ...s, error: 'Playback blocked. Click to play.' }));
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    setState((s) => ({ ...s, volume: clamped }));
  }, []);

  return { ...state, play, pause, toggle, seek, setVolume };
}
