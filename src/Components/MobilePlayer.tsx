import { useStoreState } from "easy-peasy";
import { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import { StoreModel } from "../Store/Player";
import { Song } from "./Dashboard";

const MobilePlayer: React.FunctionComponent = (props) => {
  const song: Song = useStoreState<StoreModel>((state) => state.song);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="mobile-player-bar flex justify-around items-center bg-mygrey-700 opacity-90 fixed bottom-0 w-[98%] h-24 text-white rounded m-1">
      <div className="song-info flex items-center gap-4">
        <div className="h-16 w-16">
          <img src={song.image_url} alt={song.name} />
        </div>
        <span className="capitalize">{song.name}</span>
      </div>
      <div className="flex text-4xl gap-4">
        {playing ? (
          <button
            className=""
            onClick={() => {
              setPlaying(!playing);
            }}
          >
            <MdPauseCircle></MdPauseCircle>
          </button>
        ) : (
          <button
            className=""
            onClick={() => {
              setPlaying(!playing);
            }}
          >
            <MdPlayCircle></MdPlayCircle>
          </button>
        )}
        <BiHeart></BiHeart>
      </div>
    </div>
  );
};

export default MobilePlayer;
