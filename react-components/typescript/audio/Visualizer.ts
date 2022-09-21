import AudioContext from './AudioContext';

let drawVisual: number;

interface VisualizerProps {
  canvas: HTMLCanvasElement;
  backgroundColor?: string;
  strokeColor?: string;
  variant?: 'default' | 'sine-wave' | 'bar' | 'circle';
  fftSize?: number;
  capColor?: string;
  gap?: number;
  meterWidth?: number;
  meterColor?: Array<{ stop: number; color: string }> | string;
  meterCount?: number;
  capHeight?: number;
}

class Visualizer {
  private canvasCtx: CanvasRenderingContext2D;
  private backgroundColor: string;
  private strokeColor: string;
  private variant: string;
  private capColor: string;
  private gap: number;
  private meterWidth: number;
  private meterColor: Array<{ stop: number; color: string }> | string;
  private meterCount: number;
  private capHeight: number;
  private height: number;
  private width: number;
  private fftSize: number;
  private analyser: AnalyserNode;

  constructor({
    canvas,
    backgroundColor = '#F7F6F3',
    strokeColor = '#27288A',
    variant = 'default',
    fftSize = 2048,
    capColor = '#00FFFF',
    gap = 3,
    meterWidth = 2,
    meterColor = [
      { stop: 0, color: '#ff0000' },
      { stop: 0.5, color: '#0CD7FD' },
      { stop: 1, color: '#ff0000' }
    ],
    meterCount,
    capHeight = 2
  }: VisualizerProps) {
    this.width = canvas.width;
    this.backgroundColor = backgroundColor;
    this.height = canvas.height;
    this.strokeColor = strokeColor;
    this.variant = variant;
    this.capColor = capColor;
    this.gap = gap;
    this.meterWidth = meterWidth;
    this.meterColor = meterColor;
    if (meterCount) {
      this.meterCount = meterCount;
    } else {
      this.meterCount = Math.ceil(canvas.width / (gap + meterWidth));
    }
    this.capHeight = capHeight;
    this.fftSize = fftSize;
    this.analyser = AudioContext.getAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.canvasCtx = canvas.getContext('2d')!;
  }

  start() {
    switch (this.variant) {
      case 'sine-wave': {
        this.sineWave();
        break;
      }
      case 'bar': {
        this.frequencyBars();
        break;
      }
      case 'circle': {
        this.frequencyCircles();
        break;
      }
      default: {
        this.frequencyDefault();
      }
    }
  }

  drawBackground() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    // Draw background
    this.canvasCtx.fillStyle = this.backgroundColor;
    this.canvasCtx.fillRect(0, 0, this.width, this.height);
  }

  frequencyDefault() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const step = Math.round(dataArray.length / this.meterCount);

    const self = this;

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      self.analyser.getByteFrequencyData(dataArray);

      self.drawBackground();

      for (let i = 0; i < self.meterCount; i++) {
        const value = dataArray[i * step] / 4;

        if (value === 0) {
          self.canvasCtx!.fillStyle = '#D3D5D3';
        } else {
          self.canvasCtx!.fillStyle = self.strokeColor;
        }

        const x = i * (self.meterWidth + self.gap);
        const y = self.height / 2 - value / 2;
        const width = self.meterWidth;
        const height = value + self.meterWidth;

        self.canvasCtx.fillRect(x, y, width, height);
      }
    }
    draw();
  }

  frequencyGradient() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const self = this;
    self.canvasCtx.clearRect(0, 0, self.width, self.height);

    function draw() {
      const capYPositionArray: any[] = [];

      const step = Math.round(dataArray.length / self.meterCount);
      self.canvasCtx.clearRect(0, 0, self.width, self.height + 2);

      // Draw background
      self.canvasCtx.fillStyle = self.backgroundColor;
      self.canvasCtx.fillRect(0, 0, self.width, self.height);

      self.analyser.getByteFrequencyData(dataArray);

      let gradient: CanvasGradient | string | CanvasPattern = self.canvasCtx!.createLinearGradient(0, 0, 0, 300);
      if (self.meterColor.constructor === Array) {
        const stops = self.meterColor;
        const len = stops.length;
        for (let i = 0; i < len; i++) {
          gradient.addColorStop(stops[i]['stop'], stops[i]['color']);
        }
      } else if (typeof self.meterColor === 'string') {
        gradient = self.meterColor;
      }

      for (let i = 0; i < self.meterCount; i++) {
        const value = dataArray[i * step];
        if (capYPositionArray.length < Math.round(self.meterCount)) {
          capYPositionArray.push(value);
        }

        self.canvasCtx!.fillStyle = self.capColor;

        // draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
          // let y = cHeight - (--capYPositionArray[i])
          const preValue = --capYPositionArray[i];
          const y = ((270 - preValue) * self.height) / 270;
          self.canvasCtx?.fillRect(i * (self.meterWidth + self.gap), y, self.meterWidth, self.capHeight);
        } else {
          // let y = cHeight - value
          const y = ((270 - value) * self.height) / 270;
          self.canvasCtx?.fillRect(i * (self.meterWidth + self.gap), y, self.meterWidth, self.capHeight);
          capYPositionArray[i] = value;
        }
        // set the fill Style to gradient for a better look

        self.canvasCtx!.fillStyle = gradient;

        // let y = cHeight - value + this.props.capHeight
        const y = ((270 - value) * self.height) / 270 + self.capHeight;
        self.canvasCtx?.fillRect(i * (self.meterWidth + self.gap), y, self.meterWidth, self.height);
      }
    }

    drawVisual = requestAnimationFrame(draw);
  }

  sineWave() {
    const bufferLength = this.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const self = this;

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      self.analyser.getByteTimeDomainData(dataArray);

      self.canvasCtx.fillStyle = self.backgroundColor;
      self.canvasCtx.fillRect(0, 0, self.width, self.height);

      self.canvasCtx.lineWidth = 2;
      self.canvasCtx.strokeStyle = self.strokeColor;

      self.canvasCtx.beginPath();

      const sliceWidth = self.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * self.height) / 2;

        if (i === 0) {
          self.canvasCtx.moveTo(x, y);
        } else {
          self.canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      self.canvasCtx.lineTo(self.width, self.height / 2);
      self.canvasCtx.stroke();
    }

    draw();
  }

  frequencyBars() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const self = this;

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      self.analyser.getByteFrequencyData(dataArray);

      const barWidth = (self.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        self.canvasCtx.fillStyle = self.strokeColor;
        self.canvasCtx.fillRect(x, self.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }

    draw();
  }

  frequencyCircles() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const self = this;

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      self.analyser.getByteFrequencyData(dataArray);
      const reductionAmount = 3;
      const reducedDataArray = new Uint8Array(bufferLength / reductionAmount);

      for (let i = 0; i < bufferLength; i += reductionAmount) {
        let sum = 0;
        for (let j = 0; j < reductionAmount; j++) {
          sum += dataArray[i + j];
        }
        reducedDataArray[i / reductionAmount] = sum / reductionAmount;
      }

      self.canvasCtx.clearRect(0, 0, self.width, self.height);
      self.canvasCtx.beginPath();
      self.canvasCtx.arc(self.width / 2, self.height / 2, Math.min(self.height, self.width) / 2, 0, 2 * Math.PI);
      self.canvasCtx.fillStyle = self.backgroundColor;
      self.canvasCtx.fill();
      const stepSize = Math.min(self.height, self.width) / 2.0 / reducedDataArray.length;
      self.canvasCtx.strokeStyle = self.strokeColor;

      for (let i = 0; i < reducedDataArray.length; i++) {
        self.canvasCtx.beginPath();
        const normalized = reducedDataArray[i] / 128;
        const r = stepSize * i + stepSize * normalized;
        self.canvasCtx.arc(self.width / 2, self.height / 2, r, 0, 2 * Math.PI);
        self.canvasCtx.stroke();
      }
    }

    draw();
  }

  onCancel() {
    cancelAnimationFrame(drawVisual);
  }
}

export default Visualizer;
