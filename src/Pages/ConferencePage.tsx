import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChatBox } from "../Components/ChatBox";
import { newPeerConnection } from "../peerConnection";
import { connectToWS } from "../websocket/Websocket";

type podcastMeetProps = {};

type podcastParam = {
  roomId: string;
};

const ConferencePage: React.FunctionComponent<podcastMeetProps> = (props) => {
  const [stream, setStream] = useState<MediaStream | null>(new MediaStream());
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    new MediaStream()
  );
  const pc = newPeerConnection();
  const [localOffer, setLocalOffer] = useState<string | null>(null);
  const { roomId } = useParams<podcastParam>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  let websocket: WebSocket = connectToWS(roomId == null ? "waiting" : roomId);

  useEffect(() => {
    document.title = "Conference";

    const config: MediaStreamConstraints = {
      audio: false,
      video: {
        height: {
          ideal: 960,
        },
        width: {
          ideal: 1280,
        },
      },
    };

    let makingOffer = false;
    let polite = true;
    let ignoreOffer = true;

    websocket.onmessage = async (msg) => {
      try {
        const jsonMsg = JSON.parse(msg.data);
        const body = JSON.parse(jsonMsg.Body);
        const callDesc = body.description;
        console.log("cLLDESC", JSON.parse(atob(callDesc)));

        if (callDesc) {
          const offerCollision =
            callDesc.type === "offer" &&
            (makingOffer || pc.signalingState !== "stable");

          let ignoreOffer = !polite && offerCollision;
          if (ignoreOffer) {
            return;
          }

          await pc.setRemoteDescription(JSON.parse(atob(callDesc)));
          if (callDesc.type === "offer") {
            await pc.setLocalDescription();
            websocket.send(
              JSON.stringify({
                description: Buffer.from(
                  JSON.stringify(pc.localDescription),
                  "base64"
                ),
              })
            );
          }
        } else if (body.candidate) {
          try {
            await pc.addIceCandidate(body.candidate);
          } catch (err) {
            if (!ignoreOffer) {
              throw err;
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    openCamera(config);
  }, []);

  function openCamera(config: MediaStreamConstraints) {
    let devices = navigator.mediaDevices.enumerateDevices();

    devices.then((device) => console.log(device));

    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
      videoRef.current!.srcObject = mediaStream;
      remoteVideoRef.current!.srcObject = mediaStream;
    });
  }

  const handleIncomingCall = (e: RTCPeerConnectionIceEvent) => {
    console.log("got a call");
    websocket.send(JSON.stringify(e));
  };

  async function negotiateOffer() {
    let offer = await pc.createOffer();
    console.log("negotiate offer", offer);
    await pc.setLocalDescription(offer);

    websocket.send(
      JSON.stringify({
        type: "video-call",
        description: btoa(JSON.stringify(pc.localDescription)),
      })
    );

    pc.onnegotiationneeded = async () => {
      let offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("needed negotiation", offer);

      //   websocket.send(
      //     JSON.stringify({
      //       type: "video-call",
      //       description: btoa(JSON.stringify(pc.localDescription)),
      //     })
      //   );
    };

    pc.onicecandidate = handleIncomingCall;
  }

  let streams: any[] = [
    { name: "abc", ref: videoRef },
    { name: "pre", ref: remoteVideoRef },
  ];

  return (
    <Box bgColor={"black"}>
      <Grid templateColumns="20rem auto 2rem" gap={1}>
        <GridItem>
          <ChatBox roomId={roomId} ws={websocket} />
        </GridItem>

        <GridItem paddingTop={1}>
          <Box
            padding={1}
            borderRadius={"16px"}
            // bgImage={"linear-gradient(to bottom, #FDFCFB, #E2D1C3)"}
            height="99vh"
            position={"relative"}
          >
            <Box
              display={"grid"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              gridTemplateRows={"repeat(3, 1fr)"}
              height={"85%"}
              gridGap={1}
            >
              {streams.map((item, index) => (
                <Box
                  key={index}
                  border={"1px solid gray"}
                  borderRadius={16}
                  display="grid"
                  placeItems={"center"}
                  bgColor="black"
                  // backgroundImage="linear-gradient(to bottom right, #FF61D2, #FE9090)"
                >
                  <video
                    id={"video-" + index}
                    src=""
                    autoPlay
                    ref={item.ref}
                    style={{ transform: "scaleX(-1)" }}
                  ></video>
                  <audio id={index + "-audio"} autoPlay></audio>
                </Box>
              ))}
              <Box border={"1px solid pink"} className="video-box">
                <video id="screen-share" autoPlay></video>
              </Box>
              <Button
                onClick={(e) => {
                  negotiateOffer();
                }}
              ></Button>
            </Box>
          </Box>
        </GridItem>
      </Grid>

      <Outlet />
    </Box>
  );
};

type videoProps = {
  videoId: string;
  ref: any;
  srcObject: MediaProvider | null;
};

export default ConferencePage;
