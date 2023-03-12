import { Box, Button, Grid, GridItem, IconButton } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { Link, Outlet, useParams } from "react-router-dom";
import { ChatBox } from "../Components/ChatBox";
import Constants from "../Components/Constants";
import { createConnectionOffer, newPeerConnection } from "../peerConnection";
import { connectToWS } from "../websocket/Websocket";

type podcastMeetProps = {};

type podcastParam = {
  roomId: string;
};

const PodcastMeetPage: React.FunctionComponent<podcastMeetProps> =
  React.forwardRef((props, ref) => {
    const [micState, setMicState] = useState<boolean>(false);
    const [videoState, setVideoState] = useState<boolean>(true);
    const [screenShare, setScreenShare] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(new MediaStream());
    const [screenStream, setScreenStream] = useState<MediaStream | null>(
      new MediaStream()
    );
    const [recording, setRecording] = useState<boolean>(false);
    const [localOffer, setLocalOffer] = useState<string | null>(null);
    const { roomId } = useParams<podcastParam>();

    const videoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    let websocket: WebSocket = connectToWS(roomId == null ? "waiting" : roomId);

    useEffect(() => {
      document.title = "Meeting";
    }, []);

    function openAudioMic(config: MediaStreamConstraints) {
      let audio = document.querySelector("audio");
      navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
        audio!.srcObject = mediaStream;
        setStream(mediaStream);
      });
      console.log("mic opened");
    }

    function closeAudioMic(config: any) {
      stream!.getAudioTracks().forEach((t) => t.stop());
      console.log("mic closed");
      // let audio = document.querySelector("audio");
      // audio!.srcObject = null;
    }

    function openCamera(config: MediaStreamConstraints) {
      let devices = navigator.mediaDevices.enumerateDevices();

      devices.then((device) => console.log(device));

      navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
        videoRef.current!.srcObject = mediaStream;
        remoteVideoRef.current!.srcObject = mediaStream;
      });
    }

    function closeCamera(config: any) {
      stream!.getVideoTracks().forEach((t) => t.stop());
      console.log("camera closed");
      // let video = document.querySelector("video");
      // video!.srcObject = null;
    }

    async function handleScreenShare() {
      if (screenShare) {
        screenStream!.getTracks().forEach((e) => {
          e.stop();
          console.log(e);
        });
        setScreenShare(false);
        setScreenStream(null);
        return;
      }
      try {
        let screenMediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            height: {
              ideal: 960,
            },
            width: {
              ideal: 1280,
            },
          },
          audio: true,
        });

        let screen: HTMLVideoElement | null =
          document.querySelector("#screen-share");
        screen!.srcObject = screenMediaStream;
        console.log(screenMediaStream);
        setScreenShare(true);
        setScreenStream(screenMediaStream);
      } catch (ex) {
        console.log("Error occurred", ex);
      }
    }

    async function killConnection() {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(Constants.API + "/remote/description/stop", {
        ...options,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    async function fetchRemoteAnswer(offer: string): Promise<string> {
      let token: string = "";

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ remote_description_token: offer }),
      };
      await fetch(Constants.API + "/remote/description/get", {
        ...options,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then((data) => {
          console.log(data);
          token = data.remote_description_token;
          setRecording(true);
        })
        .catch((err) => {
          console.log(err);
        });

      return token;
    }

    function negotiateOffer() {
      let pc = newPeerConnection();
      pc.onicecandidate = async (event) => {
        if (event.candidate === null) {
          setLocalOffer(btoa(JSON.stringify(pc.localDescription)));

          console.log(localOffer);

          let x = await fetchRemoteAnswer(
            btoa(JSON.stringify(pc.localDescription))
          );

          try {
            pc.setRemoteDescription(JSON.parse(atob(x)));
          } catch (e) {
            alert(e);
          }
        }
      };

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
              </Box>

              <Box
                id="stream-control"
                position={"absolute"}
                bottom={2}
                display={"flex"}
                alignItems="center"
                flexDir="column"
                gap={2}
                width={"99%"}
                justifySelf="center"
                padding={2}
              >
                <Box display={"flex"} gap={2}>
                  <IconButton
                    aria-label="Mute Mic"
                    colorScheme={micState ? "yellow" : undefined}
                    onClick={() => {
                      const config: MediaStreamConstraints = {
                        audio: !micState,
                        video: {
                          height: {
                            ideal: 960,
                          },
                          width: {
                            ideal: 1280,
                          },
                        },
                      };
                      setMicState(!micState);
                      micState ? closeAudioMic(config) : openAudioMic(config);
                    }}
                    icon={micState ? <MdMic /> : <MdMicOff />}
                  ></IconButton>
                  <IconButton
                    aria-label="Camera Off"
                    colorScheme={videoState ? "yellow" : undefined}
                    onClick={() => {
                      const config: MediaStreamConstraints = {
                        audio: micState,
                        video: {
                          height: {
                            ideal: 960,
                          },
                          width: {
                            ideal: 1280,
                          },
                        },
                      };

                      setVideoState(!videoState);
                      videoState ? closeCamera(config) : openCamera(config);
                    }}
                    icon={videoState ? <MdVideocam /> : <MdVideocamOff />}
                  ></IconButton>
                  <IconButton
                    aria-label="Screen Share"
                    colorScheme={screenShare ? "yellow" : undefined}
                    onClick={() => {
                      handleScreenShare();
                    }}
                    icon={
                      screenShare ? <MdStopScreenShare /> : <MdScreenShare />
                    }
                  ></IconButton>
                  <Link to="/end-call-page">
                    <IconButton
                      className="exit-meet"
                      aria-label="end call"
                      colorScheme={"red"}
                      variant={"solid"}
                      icon={<MdCallEnd />}
                    ></IconButton>
                  </Link>
                </Box>

                <Box display={"flex"} gap={8}>
                  <Button
                    className="start-meet"
                    colorScheme={"yellow"}
                    variant={"solid"}
                    onClick={async () => {
                      let pc = newPeerConnection();
                      createConnectionOffer(pc);

                      pc.onicecandidate = async (event) => {
                        if (event.candidate === null) {
                          setLocalOffer(
                            btoa(JSON.stringify(pc.localDescription))
                          );

                          console.log(localOffer);

                          let x = await fetchRemoteAnswer(
                            btoa(JSON.stringify(pc.localDescription))
                          );

                          try {
                            pc.setRemoteDescription(JSON.parse(atob(x)));
                          } catch (e) {
                            alert(e);
                          }
                        }
                      };
                    }}
                  >
                    {recording ? "StopRecording" : "Record"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        <Outlet />
      </Box>
    );
  });

type videoProps = {
  videoId: string;
  ref: any;
  srcObject: MediaProvider | null;
};

// const UserVideoBox: React.FunctionComponent<videoProps> = (props) => {
//   const videoRef = useRef(props.ref)
//   return (
//     <Box
//   border={"1px solid gray"}
//   borderRadius={16}
//   display="grid"
//   placeItems={"center"}
//   bgColor="black"
//   // backgroundImage="linear-gradient(to bottom right, #FF61D2, #FE9090)"
// >
//   <video
//     id={props.videoId + "-video"}
//     src=""
//     autoPlay
//     ref={videoRef}
//   ></video>
//   <audio id={props.videoId + "-audio"} autoPlay></audio>
// </Box>
//   );
// };

export default PodcastMeetPage;
