import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLCanvasElement> {
  stream: MediaStream;
  recordingTime: number;
}

const AudioVisualizer = ({ stream, recordingTime, ...props }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    // source.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = (dataArray: Uint8Array) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      // clear the canvas
      ctx.clearRect(
        0,
        0,
        canvasRef.current?.width!,
        canvasRef.current?.height!
      );

      ctx.fillStyle = "rgb(156, 163, 175)";
      ctx.lineWidth = 2; //width of candle/bar
      ctx.strokeStyle = "rgb(156, 163, 175)"; //color of candle/bar
      const space = canvasRef.current?.width! / dataArray.length;
      dataArray.forEach((value: number, i: number) => {
        ctx.beginPath();
        ctx.moveTo(space * i, canvasRef.current?.height!); //x,y
        ctx.lineTo(space * i, canvasRef.current?.height! - value); //x,y
        ctx.stroke();
      });
    };

    const loopingFunction = () => {
      requestAnimationFrame(loopingFunction);
      analyser.getByteFrequencyData(data);
      draw(data);
    };

    requestAnimationFrame(loopingFunction);
  }, [stream, recordingTime]);
  return <canvas ref={canvasRef} className="w-full h-full " {...props} />;
};

export default AudioVisualizer;
