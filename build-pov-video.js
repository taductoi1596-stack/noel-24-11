const { execSync } = require('child_process');
const path = require('path');

console.log('Compiling realistic POV video from pov1 -> pov6...');

// Ensure audio file exists
const audioPath = 'christmas-bgm.wav';

const cmd = `ffmpeg -y \\
  -loop 1 -t 3.5 -i pov1.png \\
  -loop 1 -t 3.0 -i pov2.png \\
  -loop 1 -t 2.5 -i pov3.png \\
  -loop 1 -t 5.0 -i pov4.png \\
  -loop 1 -t 4.0 -i pov5.png \\
  -loop 1 -t 8.0 -i pov6.png \\
  -i ${audioPath} \\
  -filter_complex "\\
    [0:v]fade=t=out:st=3.0:d=0.5[v0]; \\
    [1:v]fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v1]; \\
    [2:v]fade=t=in:st=0:d=0.5,fade=t=out:st=2.0:d=0.5[v2]; \\
    [3:v]fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v3]; \\
    [4:v]fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v4]; \\
    [5:v]fade=t=in:st=0:d=0.5[v5]; \\
    [v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[vout] \\
  " \\
  -map "[vout]" -map 6:a \\
  -c:v libx264 -preset fast -pix_fmt yuv420p \\
  -c:a aac -b:a 192k \\
  -shortest video-noel-24-11.mp4`;

const oneLineCmd = cmd.replace(/\\\r?\n\s*/g, ' ');
console.log('Executing:', oneLineCmd);
execSync(oneLineCmd, { stdio: 'inherit' });
console.log('Finished building realistic POV video: video-noel-24-11.mp4');
