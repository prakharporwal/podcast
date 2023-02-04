import React, { useEffect, useRef, useState } from "react";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { BiShuffle } from "react-icons/bi";
import {
  MdOutlinePictureInPictureAlt,
  MdSkipNext,
  MdSkipPrevious,
  MdOutlineQueueMusic,
} from "react-icons/md";
import { FiVolume1, FiVolumeX, FiVolume2, FiVolume } from "react-icons/fi";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { State, useStoreActions, useStoreState } from "easy-peasy";
import { createRef } from "react";
import { StoreModel } from "../Store/Player";
import { Song } from "./Dashboard";
import { numOfSecondsToMMSS } from "../utils/Date";
// import "./SongPlayer.css";

const SongPlayer: React.FunctionComponent<any> = (props) => {
  const [liked, setLiked] = useState(false);
  const song: Song = useStoreState<StoreModel>((state) => state.song);

  function handleLikeClick() {
    setLiked(!liked);
  }

  return (
    <section className="song-player-bar z-[100] flex flex-col justify-evenly items-center md:flex-row bg-mygrey-700 fixed bottom-0 w-full h-52 md:h-24 text-white overflow-hidden">
      <div className="flex w-full md:w-[30%]">
        <div className="mx-2 h-16 w-16 self-center">
          <img src={song.image_url} alt={song.name}></img>
        </div>
        <div className="py-4 mr-8 gap-1 w-[35%]">
          <span className="block text-sm font-semibold overflow-hidden text-ellipsis">
            {song.name}
          </span>
          <span className="text-xs overflow-hidden text-ellipsis w-full">
            {song.artist}
          </span>
        </div>
        <div className="text-lg flex gap-2">
          <button
            title="Like"
            className="song-player-button "
            onClick={handleLikeClick}
          >
            {liked ? <RiHeartFill className="text-mygreen" /> : <RiHeartLine />}
          </button>
          <button title="Picture in Picture" className="song-player-button">
            <MdOutlinePictureInPictureAlt />
          </button>
        </div>
      </div>

      <div className="w-[90%] md:w-[50%]">
        <PlayerControls />
      </div>
      <div className="flex w-[25%] invisible md:visible">
        <OtherControls />
      </div>
    </section>
  );
};

const PlayerControls: React.FunctionComponent<any> = (props) => {
  const REPEATONE = "repeatone";
  const DISABLED = "disabled";
  const ENABLED = "enabled";

  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(ENABLED);
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1);

  const queue: Song[] = useStoreState<StoreModel>((state) => state.queue);
  const song: Song = useStoreState<StoreModel>((state) => state.song);

  const updateSong = useStoreActions<StoreModel>((state) => state.changeSong);

  // const songSource = useStoreState(
  //   (state: State<StoreModel>) => state.song.audio_src
  // );

  function play() {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;

    if (audioPlayer !== null) {
      console.log("play song");
      audioPlayer.play();

      audioPlayer.addEventListener("ended", () => {
        console.log("graceful stop!");
        setPlaying(false);
        // updateSong(queue.at(2));
      });
    }
  }

  function pause() {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    if (audioPlayer !== null) {
      console.log("pause song");
      audioPlayer.pause();
    }
  }

  function seek10Forward() {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    audioPlayer.currentTime = audioPlayer.currentTime + 10;
  }

  function seek10Back() {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    audioPlayer.currentTime = audioPlayer.currentTime - 10;
  }

  function restart() {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    if (audioPlayer !== null) {
      audioPlayer.currentTime = 0;
      if (audioPlayer?.paused) {
        audioPlayer?.play();
        setPlaying(true);
      }
    }
  }

  function handlePlayingClick() {
    console.log("playing", playing);
    if (playing) {
      pause();
    } else {
      play();
    }
    setPlaying(!playing);
  }

  function handleRepeatButtonClick() {
    switch (repeat) {
      case DISABLED:
        console.log("loop enabled");
        setRepeat(ENABLED);
        break;
      case ENABLED:
        console.log("loop one");
        setRepeat(REPEATONE);
        break;
      case REPEATONE:
        console.log("loop disabled");
        setRepeat(DISABLED);
        break;
      default:
        break;
    }
  }

  function handleShuffleClick() {
    setShuffle(!shuffle);
  }

  return (
    <div className="w-full grid place-items-center">
      <div className="py-1 px-8 grid place-items-center">
        <section className="player-controls flex gap-4 justify-around text-4xl">
          <button
            title="Enable Shuffle"
            className="shuffle-toggle-button song-player-button py-4 text-xl invisible md:visible"
            onClick={handleShuffleClick}
          >
            {shuffle ? <BiShuffle className="text-mygreen" /> : <BiShuffle />}
          </button>

          <button
            title="Previous"
            className="song-player-button py-2 text-3xl invisible md:visible"
            onClick={seek10Back}
          >
            <MdSkipPrevious />
          </button>

          {playing ? (
            <button title="Pause" onClick={handlePlayingClick}>
              <AiFillPauseCircle />
            </button>
          ) : (
            <button title="Play" onClick={handlePlayingClick}>
              <AiFillPlayCircle />
            </button>
          )}
          <button
            title="Next"
            className="song-player-button text-3xl"
            onClick={seek10Forward}
          >
            <MdSkipNext />
          </button>

          {repeat === DISABLED ? (
            <button
              title="Enable Repeat"
              className="song-player-button text-xl"
              onClick={handleRepeatButtonClick}
            >
              <TbRepeat />
            </button>
          ) : repeat === ENABLED ? (
            <button
              title="Repeat Once"
              className="song-player-button text-xl"
              onClick={handleRepeatButtonClick}
            >
              <TbRepeat className="text-mygreen" />
            </button>
          ) : (
            <button
              title="Disable Repeat"
              className="song-player-button text-xl"
              onClick={handleRepeatButtonClick}
            >
              <TbRepeatOnce className="text-mygreen" />
            </button>
          )}
        </section>
      </div>
      <div className="w-full invisible md:visible">
        <AudioPlayer
          song={song}
          playing={playing}
          loop={repeat !== DISABLED}
          src={""}
        />
      </div>
    </div>
  );
};

export default SongPlayer;

const OtherControls: React.FunctionComponent<any> = (props) => {
  const MUTE = 0;
  const VOLMIN = 25;
  const VOLMID = 50;
  const VOLMAX = 100;

  const [volume, setVolume] = useState<number>(VOLMAX);

  function adjustVolume(vol: number) {
    let audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;

    if (audioPlayer !== null) {
      console.log("vol", vol);
      audioPlayer.volume = vol / 100;
    }
  }

  function handleVolumeScroll(e: React.MouseEvent<HTMLButtonElement>) {
    switch (volume) {
      case VOLMAX:
        adjustVolume(MUTE);
        setVolume(MUTE);
        break;
      case VOLMID:
        adjustVolume(VOLMAX);
        setVolume(VOLMAX);
        break;
      case VOLMIN:
        adjustVolume(VOLMID);
        setVolume(VOLMID);
        break;
      case MUTE:
        adjustVolume(VOLMIN);
        setVolume(VOLMIN);
        break;
      default:
        break;
    }
  }

  function renderVolumeButton() {
    if (volume === MUTE) return <FiVolumeX />;
    if (volume === VOLMAX) return <FiVolume2 />;
    if (volume >= VOLMID) return <FiVolume1 />;
    return <FiVolume />;
  }

  function updateVolume(newVol: number) {
    adjustVolume(newVol);
    setVolume(newVol);
  }

  return (
    <div className="w-full other-controls m-8 flex gap-4 justify-around">
      <div className="flex gap-2">
        <button
          title="Volume"
          className="song-player-button text-xl"
          onClick={(e) => handleVolumeScroll(e)}
        >
          {renderVolumeButton()}
        </button>
        <div className="volume-bar flex items-center gap-2 w-32">
          <ProgressBar
            progress={volume}
            total={100}
            updateProgress={updateVolume}
          ></ProgressBar>
          {/* <input
            className="h-1 bg-transparent cursor-pointer rounded w-full"
            type={"range"}
            min={0}
            max={100}
            value={volume}
            onChange={(e) => {
              adjustVolume(e.target.valueAsNumber);
              setVolume(e.target.valueAsNumber);
            }}
          ></input> */}
          <span className="song-player-button text-sm">{volume}</span>
        </div>
      </div>
      <Link to="queue">
        <div className="song-player-button text-2xl self-center">
          <MdOutlineQueueMusic />
        </div>
      </Link>
      {/* <Link to="queue">
        <div className="song-player-button text-2xl self-center">
          <MdOutlineQueueMusic />
        </div>
      </Link>
      <Link to="queue">
      <div className="song-player-button text-2xl self-center">
      <MdOutlineQueueMusic />
      </div>
    </Link> */}
    </div>
  );
};

const AudioPlayer: React.FunctionComponent<any> = (props) => {
  const audioRef = createRef<HTMLAudioElement>();
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState("");
  const song = props.song;

  useEffect(() => {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    if (audioPlayer === null) {
      return;
    }

    var totalDur = getSongDuration();
    setTotalDuration(numOfSecondsToMMSS(totalDur));

    if (props.playing) {
      let intervalId = setInterval(() => {
        let x: number = getCurrentTime();
        setCurrentTime(numOfSecondsToMMSS(x));
        let prgres = x * 100;
        prgres /= totalDur;
        console.log(prgres, x);
        setProgress(prgres);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [song, props.playing]);

  function getCurrentTime(): number {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    if (audioPlayer === null) {
      console.log("audioplayer", audioPlayer);
      return 1;
    }
    console.log("audioplayer", audioPlayer);

    let x = audioPlayer.currentTime;
    console.log("currtime", x);
    return x;
  }

  function getSongDuration(): number {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    if (audioPlayer === null) {
      return 1; // avoid 0 because progress calculation faces 0,0 for song progress bar
    }

    let x: number = audioPlayer.duration;
    console.log("totalTime", x);
    return x;
  }

  function updateSongCurrentTime(newTime: number) {
    const audioPlayer: HTMLAudioElement | null = document.getElementById(
      "audioplayer"
    ) as HTMLAudioElement;
    audioPlayer.currentTime = newTime;
  }

  return (
    <div className="flex items-center">
      <span className="song-player-button text-xs mr-4">{currentTime}</span>
      <ProgressBar
        // progress={audioRef.current?.currentTime || 0}
        progress={progress}
        total={100}
        updateProgress={updateSongCurrentTime}
        converting={getSongDuration()}
      ></ProgressBar>
      <audio
        id="audioplayer"
        className="w-full border"
        src={props.song.audio_src}
        loop={props.loop}
        preload="metadata"
        // controls
        hidden
        ref={audioRef}
        aria-hidden
      ></audio>
      <span className="song-player-button text-xs ml-4">{totalDuration}</span>
    </div>
  );
};
