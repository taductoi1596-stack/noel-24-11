const { execSync } = require('child_process');
const path = require('path');

console.log('Assembling video from scene1, scene2, scene3, scene4 with audio-final.wav...');

// FFmpeg command with smooth transitions
const cmd = `ffmpeg -y \\
  -loop 1 -t 5.5 -i scene1.png \\
  -loop 1 -t 5.5 -i scene2.png \\
  -loop 1 -t 6.5 -i scene3.png \\
  -loop 1 -t 6.5 -i scene4.png \\
  -i audio-final.wav \\
  -filter_complex "\\
    [0:v]fade=t=out:st=5.0:d=0.5[v0]; \\
    [1:v]fade=t=in:st=0:d=0.5,fade=t=out:st=5.0:d=0.5[v1]; \\
    [2:v]fade=t=in:st=0:d=0.5,fade=t=out:st=6.0:d=0.5[v2]; \\
    [3:v]fade=t=in:st=0:d=0.5[v3]; \\
    [v0][v1][v2][v3]concat=n=4:v=1:a=0[vout] \\
  " \\
  -map "[vout]" -map 4:a \\
  -c:v libx264 -preset fast -pix_fmt yuv420p \\
  -c:a aac -b:a 192k \\
  -shortest video-noel-24-11.mp4`;

// Convert to single line for Windows cmd/powershell
const oneLineCmd = cmd.replace(/\\\r?\n\s*/g, ' ');
console.log('Executing:', oneLineCmd);

execSync(oneLineCmd, { stdio: 'inherit' });
console.log('Successfully generated video-noel-24-11.mp4!');

