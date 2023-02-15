import { Box, Button, Grid, GridItem, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import { ChatBox } from "../Components/ChatBox";
import Constants from "../Components/Constants";
import { newPeerConnection } from "../peerConnection";

type MyState = {
  micState: boolean;
  videoState: boolean;
  stream: MediaStream | null;
  screenStream: MediaStream | null;
  screenShare: boolean;
  localOffer: any;
};

class PodcastMeetPage extends React.Component<any, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      micState: false,
      videoState: false,
      stream: new MediaStream(),
      screenShare: false,
      screenStream: new MediaStream(),
      localOffer: null,
    };
  }

  componentDidMount() {
    document.title = "Podcast";
  }

  openAudioMic(config: MediaStreamConstraints) {
    let audio = document.querySelector("audio");
    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
      audio!.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    });
    console.log("mic opened");
  }

  closeAudioMic(config: any) {
    this.state.stream!.getAudioTracks().forEach((t) => t.stop());
    console.log("mic closed");
    // let audio = document.querySelector("audio");
    // audio!.srcObject = null;
  }

  openCamera(config: MediaStreamConstraints) {
    let video: HTMLVideoElement | null = document.querySelector("#user-video");
    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
      video!.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    });
    console.log("camera opened");
  }

  closeCamera(config: any) {
    this.state.stream!.getVideoTracks().forEach((t) => t.stop());
    console.log("camera closed");
    // let video = document.querySelector("video");
    // video!.srcObject = null;
  }

  async handleScreenShare() {
    if (this.state.screenShare) {
      this.state.screenStream!.getTracks().forEach((e) => {
        e.stop();
        console.log(e);
      });
      this.setState({ screenShare: false, screenStream: null });
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
      this.setState({
        screenShare: true,
        screenStream: screenMediaStream,
      });
    } catch (ex) {
      console.log("Error occurred", ex);
    }
  }

  async killConnection() {
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

  async fetchRemoteAnswer(offer: string): Promise<string> {
    let token: string = "";

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ remote_description_token: offer }),
    };
    await fetch(Constants.API + "/remote/description/sdp", {
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
      })
      .catch((err) => {
        console.log(err);
      });

    return token;
  }

  render() {
    return (
      <Box bgColor={"black"}>
        <Grid templateColumns="20rem auto 2rem" gap={1}>
          <GridItem>
            <ChatBox roomId={""} />
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
                <UserVideoBox videoId={"user"} />
                <UserVideoBox videoId={"user-videox"} />
                <UserVideoBox videoId={"user-video4"} />
                <UserVideoBox videoId={"user-video3"} />
                <UserVideoBox videoId={"user-video3"} />
                <UserVideoBox videoId={"user-video3"} />
                <UserVideoBox videoId={"user-video3"} />
                <UserVideoBox videoId={"user-video3"} />
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
                    colorScheme={this.state.micState ? "yellow" : undefined}
                    onClick={() => {
                      const config: MediaStreamConstraints = {
                        audio: !this.state.micState,
                        video: {
                          height: {
                            ideal: 960,
                          },
                          width: {
                            ideal: 1280,
                          },
                        },
                      };
                      this.setState({ micState: !this.state.micState });
                      this.state.micState
                        ? this.closeAudioMic(config)
                        : this.openAudioMic(config);
                    }}
                    icon={this.state.micState ? <MdMic /> : <MdMicOff />}
                  ></IconButton>
                  <IconButton
                    aria-label="Camera Off"
                    colorScheme={this.state.videoState ? "yellow" : undefined}
                    onClick={() => {
                      const config: MediaStreamConstraints = {
                        audio: this.state.micState,
                        video: {
                          height: {
                            ideal: 960,
                          },
                          width: {
                            ideal: 1280,
                          },
                        },
                      };

                      this.setState({ videoState: !this.state.videoState });
                      this.state.videoState
                        ? this.closeCamera(config)
                        : this.openCamera(config);
                    }}
                    icon={
                      this.state.videoState ? <MdVideocam /> : <MdVideocamOff />
                    }
                  ></IconButton>
                  <IconButton
                    aria-label="Screen Share"
                    colorScheme={this.state.screenShare ? "yellow" : undefined}
                    onClick={() => {
                      this.handleScreenShare();
                    }}
                    icon={
                      this.state.screenShare ? (
                        <MdStopScreenShare />
                      ) : (
                        <MdScreenShare />
                      )
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
                      pc.onicecandidate = async (event) => {
                        if (event.candidate === null) {
                          this.setState({
                            localOffer: btoa(
                              JSON.stringify(pc.localDescription)
                            ),
                          });

                          console.log(this.state.localOffer);

                          let x = await this.fetchRemoteAnswer(
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
                    Join
                  </Button>
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        <Outlet />
      </Box>
    );
  }
}

type videoProps = {
  videoId: string;
};

const UserVideoBox: React.FunctionComponent<videoProps> = (props) => {
  return (
    <Box
      border={"1px solid gray"}
      borderRadius={16}
      display="grid"
      placeItems={"center"}
      bgColor="black"
      // backgroundImage="linear-gradient(to bottom right, #FF61D2, #FE9090)"
    >
      <video id={props.videoId + "-video"} src="" autoPlay></video>
      <audio id={props.videoId + "-audio"} autoPlay></audio>
    </Box>
  );
};

export default PodcastMeetPage;
