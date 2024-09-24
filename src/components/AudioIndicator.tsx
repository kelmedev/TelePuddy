import React, { useEffect, useState } from "react";

interface AudioIndicatorProps {
	isActive: boolean;
}

const AudioIndicator: React.FC<AudioIndicatorProps> = ({ isActive }) => {
	const [volume, setVolume] = useState(0);

	useEffect(() => {
		let audioContext: AudioContext | null = null;
		let analyser: AnalyserNode | null = null;
		let microphone: MediaStreamAudioSourceNode | null = null;
		let javascriptNode: ScriptProcessorNode | null = null;

		if (isActive) {
			audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					analyser = audioContext!.createAnalyser();
					microphone = audioContext!.createMediaStreamSource(stream);
					javascriptNode = audioContext!.createScriptProcessor(2048, 1, 1);

					analyser.smoothingTimeConstant = 0.8;
					analyser.fftSize = 1024;

					microphone.connect(analyser);
					analyser.connect(javascriptNode);
					javascriptNode.connect(audioContext!.destination);

					javascriptNode.onaudioprocess = () => {
						const array = new Uint8Array(analyser!.frequencyBinCount);
						analyser!.getByteFrequencyData(array);
						const values = array.reduce((a, b) => a + b, 0);
						const average = values / array.length;
						setVolume(average);
					};
				})
				.catch((err) => {
					console.error("Error accessing microphone: ", err);
				});
		}

		return () => {
			if (audioContext) {
				audioContext.close();
			}
			if (microphone) {
				microphone.disconnect();
			}
			if (analyser) {
				analyser.disconnect();
			}
			if (javascriptNode) {
				javascriptNode.disconnect();
			}
		};
	}, [isActive]);

	const getBarHeight = (multiplier: number) => {
		return Math.min(100, volume * multiplier);
	};

	return (
		<div className="flex bg-primary align-middle items-center justify-center m-auto gap-1 w-[32px] h-[32px] rounded-full">
			<div
				className="w-1 bg-white rounded-xl"
				style={{ height: `${getBarHeight(1)}%` }}
			></div>
			<div
				className="w-1 bg-white rounded-xl"
				style={{ height: `${getBarHeight(2)}%` }}
			></div>
			<div
				className="w-1 bg-white rounded-xl"
				style={{ height: `${getBarHeight(1)}%` }}
			></div>
		</div>
	);
};

export default AudioIndicator;
