function newPeerConnection(): RTCPeerConnection {
  let pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });
  createConnectionOffer(pc);
  return pc;
}

function createConnectionOffer(pc: RTCPeerConnection) {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      let media: HTMLVideoElement | null =
        document.querySelector("#user-video");
      media!.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      pc.createOffer()
        .then((d) => pc.setLocalDescription(d))
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  pc.oniceconnectionstatechange = (e) => console.log(pc.iceConnectionState);
}

function intiateASession(pc: RTCPeerConnection, remoteOfferAnswer: any) {
  let sd = remoteOfferAnswer;
  if (sd === "") {
    return alert("Session Description must not be empty");
  }

  try {
    pc.setRemoteDescription(JSON.parse(atob(sd)));
  } catch (e) {
    alert(e);
  }
}

export { intiateASession, newPeerConnection };
