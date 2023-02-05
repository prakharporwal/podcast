import { Box, Button, IconButton, Input } from "@chakra-ui/react";
import React from "react";
import {
  MdMic,
  MdMicOff,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { Outlet } from "react-router-dom";
import { ChatBox } from "../Components/ChatBox";

type MyProps = {};
type MyState = {
  micState: boolean;
  videoState: boolean;
  stream: MediaStream | null;
  screenStream: MediaStream | null;
  screenShare: boolean;
};

class JoinPodCastPage extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      micState: false,
      videoState: false,
      stream: new MediaStream(),
      screenShare: false,
      screenStream: new MediaStream(),
    };
  }

  componentDidMount() {}

  openAudioMic(config: any) {
    let audio = document.querySelector("audio");
    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
      audio!.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    });
  }

  closeAudioMic(config: any) {
    this.state.stream!.getAudioTracks().forEach((t) => t.stop());

    // let audio = document.querySelector("audio");
    // audio!.srcObject = null;
  }

  openCamera(config: any) {
    let video = document.querySelector("video");
    navigator.mediaDevices.getUserMedia(config).then((mediaStream) => {
      video!.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    });
  }

  closeCamera(config: any) {
    this.state.stream!.getVideoTracks().forEach((t) => t.stop());

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
        video: true,
        audio: true,
      });
      let screen: any = document.getElementById("screen-share");
      screen.srcObject = screenMediaStream;
      console.log(screenMediaStream);
      this.setState({
        screenShare: true,
        screenStream: screenMediaStream,
      });
    } catch (ex) {
      console.log("Error occurred", ex);
    }
  }

  render() {
    return (
      <div className="flex flex-col items-center gap-8 h-screen">
        <ChatBox />
        <Box height={"60rem"} width={"80rem"}>
          <video id="user-video" autoPlay></video>
          <audio id="user-audio" autoPlay></audio>
        </Box>
        <Box height={"40rem"} width={"60rem"}>
          <video id="screen-share" autoPlay></video>
        </Box>

        <div className="flex flex-row gap-2">
          <IconButton
            aria-label="Mute Mic"
            colorScheme={this.state.micState ? "yellow" : undefined}
            onClick={() => {
              const config = {
                audio: !this.state.micState,
                video: this.state.videoState,
              };
              this.setState({ micState: !this.state.micState });

              this.state.micState
                ? this.closeCamera(config)
                : this.openCamera(config);
            }}
            icon={this.state.micState ? <MdMic /> : <MdMicOff />}
          ></IconButton>
          <IconButton
            aria-label="Camera Off"
            colorScheme={this.state.videoState ? "yellow" : undefined}
            onClick={() => {
              const config = {
                audio: this.state.micState,
                video: !this.state.videoState,
              };
              this.setState({ videoState: !this.state.videoState });
              this.state.videoState
                ? this.closeCamera(config)
                : this.openCamera(config);
            }}
            icon={this.state.videoState ? <MdVideocam /> : <MdVideocamOff />}
          ></IconButton>
          <IconButton
            aria-label="Screen Share"
            colorScheme={this.state.screenShare ? "yellow" : undefined}
            onClick={() => {
              this.handleScreenShare();
            }}
            icon={
              this.state.screenShare ? <MdStopScreenShare /> : <MdScreenShare />
            }
          ></IconButton>
        </div>
        <Box display={"flex"} alignItems={"flex-start"} w={"40rem"}>
          <Input placeholder="http://meet.user.com/abcd123"></Input>
        </Box>
        <Button colorScheme={"yellow"} variant={"solid"}>
          Join
        </Button>
        <Outlet />
      </div>
    );
  }
}

export default JoinPodCastPage;
