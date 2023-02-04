import React from "react";
import Sidebar from "../Components/Sidebar";
import SongPlayer from "../Components/SongPlayer";
import { Outlet } from "react-router-dom";
import { StoreProvider } from "easy-peasy";
import { playerStore } from "../Store/Player";
import MobilePlayer from "../Components/MobilePlayer";

const MainPage = (props) => {
  return (
    <>
      <div className="block md:hidden text-center bg-red-500">
        Not Supporting mobile! Open On a Bigger Screen!
      </div>
      <StoreProvider store={playerStore}>
        <Sidebar />
        <div className="hidden md:block">
          <SongPlayer />
        </div>
        <div className="block md:hidden">
          <MobilePlayer />
        </div>
        <Outlet />
      </StoreProvider>
    </>
  );
};

export default MainPage;
