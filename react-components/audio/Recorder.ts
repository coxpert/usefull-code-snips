import AudioContext from './AudioContext';

interface MediaOptions {
  audioBitsPerSecond: number;
  mimeType: string;
}

interface BlobObject {
  blob: Blob;
  startTime: number;
  stopTime: number;
  blobURL: string;
}

interface RecorderProps {
  onStart?: () => void;
  onStop?: (data: BlobObject) => void;
  onSave?: (data: BlobObject) => void;
  onData?: (data: Blob) => void;
  options?: MediaOptions;
  soundOptions?: MediaTrackConstraints;
}

export class Recorder {
  static recorder: Recorder;

  private analyser?: AnalyserNode;
  private audioCtx?: AudioContext;
  private mediaRecorder?: MediaRecorder | null;
  private chunks: Blob[] = [];
  private startTime?: number;
  private stream?: MediaStream;
  private readonly mediaOptions;
  private readonly onStartCallback;
  private readonly onStopCallback;
  private readonly onSaveCallback;
  private readonly onDataCallback;
  private constraints: MediaStreamConstraints;

  constructor({
    onStart,
    onStop,
    onSave,
    onData,
    options = {
      audioBitsPerSecond: 128000,
      mimeType: 'Audio/webm;codecs=opus'
    }
  }: RecorderProps) {
    this.onStartCallback = onStart;
    this.onStopCallback = onStop;
    this.onSaveCallback = onSave;
    this.onDataCallback = onData;
    this.mediaOptions = options;

    this.constraints = {
      audio: true,
      video: false
    };
  }

  static getInstance() {
    if (!Recorder.recorder) {
      Recorder.recorder = new Recorder({});
    }
    return Recorder.recorder;
  }

  static start() {
    Recorder.getInstance().startRecording();
  }

  static stop() {
    Recorder.getInstance().stopRecording();
  }

  private startRecording = () => {
    this.startTime = Date.now();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(this.constraints).then((str: MediaStream) => {
        this.stream = str;

        if (MediaRecorder.isTypeSupported(this.mediaOptions.mimeType)) {
          this.mediaRecorder = new MediaRecorder(str, this.mediaOptions);
        } else {
          this.mediaRecorder = new MediaRecorder(str);
        }

        if (this.onStartCallback) {
          this.onStartCallback();
        }

        this.mediaRecorder.onstop = this.onStop;

        this.mediaRecorder.ondataavailable = ({ data }: { data: Blob }) => {
          this.chunks.push(data);
          if (this.onDataCallback) {
            this.onDataCallback(data);
          }
        };

        this.audioCtx = AudioContext.getAudioContext();
        this.audioCtx.resume().then(() => {
          console.log('Audio context resume event');
          this.analyser = AudioContext.getAnalyser();
          this.mediaRecorder?.start();
          const sourceNode = this.audioCtx?.createMediaStreamSource(this.stream!);
          sourceNode?.connect(this.analyser);
        });
      });
    } else {
      alert('Your browser does not support audio recording');
    }
  };

  private stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();

      this.stream?.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });

      this.mediaRecorder = null;
    }
  }

  private onStop() {
    const blob = new Blob(this.chunks);
    this.chunks = [];

    const blobObject = {
      blob,
      startTime: this.startTime!,
      stopTime: Date.now(),
      blobURL: window.URL.createObjectURL(blob)
    };

    if (this.onStopCallback) {
      this.onStopCallback(blobObject);
    }
    if (this.onSaveCallback) {
      this.onSaveCallback(blobObject);
    }
  }
}
