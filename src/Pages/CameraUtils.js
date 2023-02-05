// const config = {
//   audio: false,
//   video: {
//     width: { ideal: 1280 },
//     height: { ideal: 720 },
//   },
// };

// function getUserCameraStream(video) {
//   let mediaStream = new MediaStream();
//   var errorCallback = function (e) {
//     console.log("Reeeejected!", e);
//   };

//   navigator.getUserMedia =
//     navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia;

//   if (navigator.getUserMedia) {
//     navigator.getUserMedia(
//       { audio: true, video: true },
//       function (stream) {
//         video.srcObject = stream;
//       },
//       errorCallback
//     );
//   } else {
//     video.src = "somevideo.webm"; // fallback.
//   }
//   return mediaStream;
// }

// export { getUserCameraStream };
