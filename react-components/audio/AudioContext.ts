const AudioContext: {
  audioCtx?: AudioContext;
  analyser?: AnalyserNode;
  getAudioContext: () => AudioContext;
  getAnalyser: () => AnalyserNode;
  resetAnalyser: () => void;
  initialize: () => void;
} = {
  initialize() {
    if (this.audioCtx === undefined) {
      this.audioCtx = new window.AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
    }
  },
  getAudioContext() {
    this.initialize();
    return this.audioCtx!;
  },

  getAnalyser() {
    this.initialize();
    return this.analyser!;
  },

  resetAnalyser() {
    this.analyser = this.audioCtx?.createAnalyser();
  }
};

export default AudioContext;
