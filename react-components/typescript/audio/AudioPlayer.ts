import AudioContext from './AudioContext';
const AudioPlayer: {
  audioSource?: MediaElementAudioSourceNode;
  create: (audioElem: HTMLAudioElement) => void;
  disconnect: () => void;
} = {
  create(audioElem: HTMLAudioElement) {
    const audioCtx = AudioContext.getAudioContext();
    const analyser = AudioContext.getAnalyser();
    if (this.audioSource === undefined) {
      this.audioSource = audioCtx?.createMediaElementSource(audioElem);
    }
    this.audioSource?.connect(analyser!);
    analyser?.connect(audioCtx!.destination);
  },
  disconnect() {
    this.audioSource?.disconnect();
    const analyser = AudioContext.getAnalyser();
    analyser.disconnect();
  }
};
export default AudioPlayer;
