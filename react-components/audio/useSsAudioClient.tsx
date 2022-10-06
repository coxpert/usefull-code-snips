/**
 *  Hooks for SpokeStack client methods
 */

import { useEffect, useRef, useState } from 'react';

import { concatenateAudioBuffers, record, startProcessor, stopProcessor, ProcessorReturnValue, stopStream as stopAudioStream } from 'spokestack/client';
import WavEncoder from 'wav-encoder';
import { arrayBufferToBase64 } from '../../utils/helpers';

export interface RecordType {
  text: string;
  base64: string;
  encoded: ArrayBuffer;
}

export interface RecorderType {
  audioElm?: HTMLAudioElement;

  // settings
  recordTime: number;

  // data
  records: Array<RecordType>;
  error: string | null;
  script: string;
  source: string | null;
  encoded: ArrayBuffer | null;

  // status variables
  playing: boolean;
  recording: boolean;
  paused: boolean;
  dataReceived: boolean;

  // audio play actions
  play: () => void;
  stop: () => void;
  clear: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;

  // setters
  getAudioSource: () => string | null;
  setAudioSource: (source: string) => void;
  setRecordTime: (s: number) => void;

  // record actions
  startRecord: (restart?: boolean) => Promise<RecordType>;
  startStream: (restart?: boolean) => Promise<RecordType>;
  stopStream: () => void;
  buffer: AudioBuffer | null;
}

const MAX_VOICE_RECORD_TIME = 5; // max time to record voice in (s)

export function useSsAudioClient(): RecorderType {
  // Text streaming script for the voice from microphone
  const [script, setScript] = useState<string>('');

  // Audio Element to replay recorded voice or sounds from mic phone
  // or we can set source of it outside by using setAudioSource
  const [audioElm, setAudioElm] = useState<HTMLAudioElement>();

  // Array of recorded data which contains the history of recording
  const [records, setRecords] = useState<Array<RecordType>>([]);

  // Raw value from complete record stream
  const [encoded, setEncoded] = useState<ArrayBuffer | null>(null);

  // Status of recording
  const [recording, setRecording] = useState<boolean>(false);

  // Status of playing audio element
  const [playing, setPlaying] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  // Error text
  const [error, setError] = useState<string | null>(null);
  const [dataReceived, setDataReceived] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [processorRet, setProcessorRet] = useState<ProcessorReturnValue | null>(null);
  // Max record time. it can be changed outside by using setRecordTime
  // Recording can be canceled by force before that time, otherwise, it will be stopped automatically after that time.
  const [recordTime, setVoiceRecordTime] = useState<number>(MAX_VOICE_RECORD_TIME);

  const [rerecording, setRerecording] = useState<boolean>(false);

  // Audio source (url, base64 string, etc)
  const [source, setSource] = useState<string | null>(null);

  const recordTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audioElement = document.createElement('audio');
    document.body.appendChild(audioElement);
    setAudioElm(audioElement);

    function handleAudioPlayEnd() {
      audioElement.currentTime = 0;
      setPlaying(false);
      setPaused(false);
    }

    audioElement.addEventListener('ended', handleAudioPlayEnd);

    return () => {
      audioElement.removeEventListener('ended', handleAudioPlayEnd);
      audioElement.remove();
    };
  }, []);

  const setAudioSource = (source: string) => {
    setSource(source);
  };

  const getAudioSource = (): string | null => {
    return source;
  };

  const reset = () => {
    stop();
    setRecording(false);
    setScript('');
    setError('');
  };

  const clear = () => {
    reset();
    setRecords([]);
    setRerecording(false);
  };

  const toggle = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
  };

  const play = () => {
    if (audioElm && source) {
      audioElm
        .play()
        .then(() => {
          setPaused(false);
          setPlaying(true);
        })
        .catch((error) => {
          setPlaying(false);
          console.error('ERROR: playing record', error);
        });
    }
  };

  const pause = () => {
    audioElm!.pause();
    setPlaying(false);
    setPaused(true);
  };

  const setRecordTime = (s: number) => {
    setVoiceRecordTime(s);
  };

  const stop = () => {
    if (playing) {
      audioElm!.pause();
      audioElm!.currentTime = 0;
      setPlaying(false);
    }
  };

  const startRecord = (restart?: boolean): Promise<RecordType> => {
    return new Promise((resolve, reject) => {
      if (restart) {
        setRerecording(restart);
      }
      reset();
      record({
        onStart: () => {
          setRecording(true);
        },
        onProgress: (remaining) => {
          console.log(remaining);
        },
        time: recordTime
      })
        .then((buffer) => {
          recordingComplete(buffer)
            .then((record) => {
              resolve(record);
            })
            .catch((err) => {
              resolve(err);
            });
        })
        .catch((err: Error) => {
          setError(`There was a problem recording. Please try again. Details: ${err.message}`);
          reject(err);
        });
    });
  };

  // Recording Complete Handler
  const recordingComplete = async (buffer: AudioBuffer): Promise<RecordType> => {
    return new Promise((resolve, reject) => {
      WavEncoder.encode({
        sampleRate: buffer.sampleRate,
        channelData: [...Array(buffer.numberOfChannels)].map((_, i) => buffer.getChannelData(i))
      })
        .then((encoded: ArrayBuffer) => {
          const record = {
            text: script,
            base64: arrayBufferToBase64(encoded!),
            encoded: encoded
          };

          if (rerecording) {
            records[records.length - 1] = record;
          } else {
            records.push(record);
          }
          setRecords([...records]);

          resolve(record);

          const base64AudioSource = `data:Audio/mp3;base64,${arrayBufferToBase64(encoded!)}`;

          setSource(base64AudioSource);
          audioElm!.src = base64AudioSource;
          setEncoded(encoded);
        })
        .catch((error: any) => {
          reject(error);
          setError('There was a problem creating the WAV file. Please refresh and try again.');
        })
        .finally(() => {
          setRecording(false);
        });
    });
  };

  const startStream = async (restart?: boolean): Promise<RecordType> => {
    return new Promise(async (resolve, reject) => {
      reset();
      if (restart) {
        setRerecording(restart);
      }
      try {
        let context: AudioContext | null;
        let processor: ScriptProcessorNode | null;

        if (processorRet) {
          context = processorRet.context;
          processor = processorRet.processor;
        }

        if (recording) {
          streamClosed();
          return;
        }

        let buff: AudioBuffer | null;
        setDataReceived(false);

        const [error, result] = await startProcessor();
        if (result) {
          context = result.context;
          processor = result.processor;
        } else {
          console.error(error);
          setError('There was a problem with recording. Please refresh and try again');
          return;
        }

        setRecording(true);
        setProcessorRet(result as ProcessorReturnValue);

        processor.onaudioprocess = function (e: AudioProcessingEvent) {
          setDataReceived(true);
          buff = concatenateAudioBuffers(buff, e.inputBuffer, context!);
          setBuffer(buff);
        };

        function streamClosed() {
          setRecording(false);
          if (processor) {
            processor.onaudioprocess = null;
          }
          stopProcessor();
          clearTimeout(recordTimeout.current!);
          if (buff) {
            recordingComplete(buff)
              .then((record) => {
                resolve(record);
              })
              .catch((err) => {
                reject(err);
              });
          }
        }

        recordTimeout.current = setTimeout(streamClosed, recordTime * 1000);
      } catch (e) {
        setRecording(false);
        setError('There was a problem with recording. Please refresh and try again');
        reject(e);
      }
    });
  };

  const stopStream = () => {
    setRecording(false);
    stopAudioStream();
  };

  return {
    audioElm,
    playing,
    recording,
    error,
    script,
    startRecord,
    play,
    stop,
    pause,
    startStream,
    records,
    reset,
    setRecordTime,
    stopStream,
    clear,
    encoded,
    toggle,
    getAudioSource,
    setAudioSource,
    recordTime,
    source,
    paused,
    dataReceived,
    buffer
  };
}
