const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const music = document.getElementById("music");

// Set proper canvas size
canvasElement.width = 500;
canvasElement.height = 400;

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(onResults);

function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    // Draw landmarks
    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00'});
    drawLandmarks(canvasCtx, landmarks, {color: '#FF0000'});

    let fingers = 0;

    if (landmarks[8].y < landmarks[6].y) fingers++;   // Index
    if (landmarks[12].y < landmarks[10].y) fingers++; // Middle
    if (landmarks[16].y < landmarks[14].y) fingers++; // Ring
    if (landmarks[20].y < landmarks[18].y) fingers++; // Pinky

    if (fingers === 1) {
      music.play();
    } 
    else if (fingers === 2) {
      music.pause();
    } 
    else if (fingers === 4) {
      document.body.style.background =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  }
}

// Camera setup
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 500,
  height: 400
});

camera.start();