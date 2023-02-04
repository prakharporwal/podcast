import { useState } from "react";
import { MdPauseCircleFilled, MdPlayCircleFilled } from "react-icons/md";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { AiOutlineEllipsis } from "react-icons/ai";
import { Song, songList1 } from "./Dashboard";
import { BiTime } from "react-icons/bi";
import { useStoreActions, useStoreState } from "easy-peasy";
import { StoreModel } from "../Store/Player";
import { SongListItem } from "./SongListItem";

interface SongList {
  songsList: Song[];
}

const SongQueue: React.FunctionComponent<SongList> = (props) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);

  const queueList: Song[] = useStoreState<StoreModel>((state) => state.queue);
  function handleLikeClick() {
    setLiked(!liked);
  }

  return (
    <div className="relative z-[-100] w-full">
      <div className="absolute top-0 md:left-64 left-0 min-h-screen md:w-[calc(100vw-16rem)] w-full bg-mygrey-600 text-white">
        <div className="flex flex-col px-8 gap-5 justify-end h-12">
          <span className="font-semibold text-base">Queue</span>
        </div>
        <div className="overflow-y-auto">
          <table className="table-auto w-full mb-24">
            {/* <tr className="flex gap-4 text-left rounded p-2 text-mygrey-200 uppercase font-normal text-sm">
              <th className="font-normal w-12">{"#"}</th>
              <th className="font-normal w-96">{"Title"}</th>
              <th className="font-normal w-80">{"Album"}</th>
              <th className="font-normal">
                <BiTime />
              </th>
            </tr> */}
            <tbody>
              {queueList.length === 0 && (
                <SongListItem
                  index={0}
                  song={{
                    name: "",
                    artist: "",
                    image_url: "",
                    audio_src: "",
                  }}
                />
              )}
              {queueList.map((song, ind) => {
                return <SongListItem index={ind} song={song} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SongQueue;
