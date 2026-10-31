const fs = require('fs');
const { execSync } = require('child_process');

const sampleRate = 44100;
const noteFreqs = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99,
  'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50,
  'REST': 0
};

// 'We Wish You a Merry Christmas' melody
const carolMelody = [
  { note: 'D4', dur: 0.4 },
  { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.2 }, { note: 'A4', dur: 0.2 }, { note: 'G4', dur: 0.2 }, { note: 'F#4', dur: 0.2 },
  { note: 'E4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'E4', dur: 0.4 },
  { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'A4', dur: 0.2 }, { note: 'G4', dur: 0.2 },
  { note: 'F#4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'D4', dur: 0.4 },
  { note: 'B4', dur: 0.4 }, { note: 'B4', dur: 0.2 }, { note: 'C5', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'A4', dur: 0.2 },
  { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.2 }, { note: 'D4', dur: 0.2 },
  { note: 'E4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'F#4', dur: 0.4 },
  { note: 'G4', dur: 0.9 }, { note: 'REST', dur: 0.4 },
  // Jingle Bells
  { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.6 },
  { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.6 },
  { note: 'B4', dur: 0.3 }, { note: 'D5', dur: 0.3 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.2 },
  { note: 'B4', dur: 1.0 }, { note: 'REST', dur: 0.4 },
  { note: 'C5', dur: 0.3 }, { note: 'C5', dur: 0.3 }, { note: 'C5', dur: 0.4 }, { note: 'C5', dur: 0.2 },
  { note: 'C5', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 },
  { note: 'D5', dur: 0.3 }, { note: 'D5', dur: 0.3 }, { note: 'C5', dur: 0.3 }, { note: 'A4', dur: 0.3 },
  { note: 'G4', dur: 1.5 }
];

let totalDuration = 24.0;
const totalSamples = Math.floor(totalDuration * sampleRate);
const samples = new Float32Array(totalSamples);

let curSample = 0;
for (const item of carolMelody) {
  const noteDuration = item.dur;
  const noteSamples = Math.floor(noteDuration * sampleRate);
  const freq = noteFreqs[item.note] || 0;

  if (freq > 0) {
    for (let s = 0; s < noteSamples && (curSample + s) < totalSamples; s++) {
      const t = s / sampleRate;
      const env = Math.exp(-t * 3.5);
      const sig1 = Math.sin(2 * Math.PI * freq * t);
      const sig2 = 0.4 * Math.sin(2 * Math.PI * freq * 2 * t);
      const sig3 = 0.2 * Math.sin(2 * Math.PI * freq * 3 * t);
      const val = (sig1 + sig2 + sig3) * env * 0.4;
      samples[curSample + s] += val;
    }
  }
  curSample += noteSamples;
}

// Convert to 16-bit PCM WAV
const buffer = Buffer.alloc(44 + totalSamples * 2);
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + totalSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(totalSamples * 2, 40);

for (let i = 0; i < totalSamples; i++) {
  let s = Math.max(-1, Math.min(1, samples[i]));
  buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
}

fs.writeFileSync('christmas-bgm.wav', buffer);
console.log('Generated christmas-bgm.wav');

// Generate voiceover with PowerShell SAPI
try {
  execSync(`powershell -Command "Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SetOutputToWaveFile('speech-temp.wav'); $s.Speak('Merry Christmas! Chuc ban mot mua Giang sinh Noel 24 thang 11 that am ap va an lanh!'); $s.Dispose()"`, { stdio: 'inherit' });
  // Mix bgm and voiceover
  execSync(`ffmpeg -y -i christmas-bgm.wav -i speech-temp.wav -filter_complex "[1:a]adelay=14000|14000,volume=1.8[voice];[0:a]volume=0.45[bgm];[bgm][voice]amix=inputs=2:duration=first:dropout_transition=2[aout]" -map "[aout]" audio-final.wav`, { stdio: 'inherit' });
} catch (e) {
  console.log('Voice synthesis fallback to pure bgm');
  fs.copyFileSync('christmas-bgm.wav', 'audio-final.wav');
}

console.log('audio-final.wav is ready!');
