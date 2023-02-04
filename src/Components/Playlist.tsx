import React, { useEffect, useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { MdPauseCircleFilled, MdPlayCircleFilled } from "react-icons/md";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { songList1 } from "./Dashboard";

import "./Playlist.css";
import { SongListItem } from "./SongListItem";

const Playlist: React.FunctionComponent<any> = (props) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);

  const { id } = useParams();
  const [showSongMenu, setShowSongMenu] = useState(false);

  useEffect(() => {
    console.log(id);
  });

  function handleLikeClick() {
    setLiked(!liked);
  }

  return (
    <div className="fixed z-[-100]">
      <div className="absolute md:left-64 left-0 min-h-screen md:w-[calc(100vw-16rem)] w-full bg-gradient-to-b from-pink-700 to-black text-white h-screen overflow-y-auto">
        <div className="flex m-8">
          <span>
            <img className="h-52 w-52" src={"images/sing-play.jpg"} alt={""} />
          </span>
          <div className="flex flex-col px-8 gap-5 justify-end">
            <span className="font-semibold text-xs uppercase">Artist </span>
            <span className="text-6xl font-bold">Daily Mix</span>
            <span className="text-sm">
              Ritviz, When Chai Met Toast, Dream Note and more
            </span>
          </div>
        </div>
        <div className="bg-mygrey-600/[0.5]">
          <div className="p-4 flex items-center gap-4">
            <button
              className="bg-mygrey-600 rounded-[50%] text-6xl"
              onClick={() => {
                console.log("hello");
                setPlay(!play);
              }}
            >
              {play ? (
                <MdPauseCircleFilled className="text-mygreen" />
              ) : (
                <MdPlayCircleFilled className="text-mygreen" />
              )}
            </button>
            <button
              title="Like"
              className="song-player-button mygreen text-4xl"
              onClick={handleLikeClick}
            >
              {liked ? (
                <RiHeartFill className="text-mygreen" />
              ) : (
                <RiHeartLine />
              )}
            </button>
            <button
              title="Like"
              className="song-player-button mygreen text-4xl"
              onClick={() => setShowSongMenu(!showSongMenu)}
            >
              <AiOutlineEllipsis />
              <div className="w-12"></div>
            </button>
          </div>

          <table className="table-auto w-full mb-24">
            {/* <thead className="flex gap-4 text-left rounded p-2 text-mygrey-200 uppercase font-normal text-sm"> */}
            <thead className="text-left rounded text-mygrey-200 uppercase font-normal text-sm">
              <tr>
                <th>
                  <span className="p-4">{"#"}</span>
                </th>
                <th>
                  <span className="p-2">{"Title"}</span>
                </th>
                <th>
                  <span className="p-2">{"Album"}</span>
                </th>
                <th>
                  <span className="p-2">
                    <BiTime />
                  </span>
                </th>
                <th>{"Duration"}</th>
              </tr>
            </thead>
            <tbody>
              {songList1.map((song, ind) => {
                return <SongListItem index={ind} song={song} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
