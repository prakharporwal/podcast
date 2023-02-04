import { action, Action, createStore, debug } from "easy-peasy";
import { Song } from "../Components/Dashboard";

interface StoreModel {
  song: Song;
  changeSong: Action<any, any>;
  queue: Song[];
  updateQueue: Action<any, any>;
  // currentSongIndex: number;
  // updateSongByIndex: Action<any, any>;
}

const playerStore = createStore<StoreModel>({
  song: {
    audio_src: "songs/aziyat.mp3",
    name: "Dance",
    image_url: "images/song-mix.jpg",
    artist: "Pratband",
  },
  changeSong: action((state: any, payload: any) => {
    console.log(debug(state));
    state.song = payload;
  }),
  queue: [
    {
      audio_src: "songs/aziyat.mp3",
      name: "Aziyat",
      image_url: "images/song-mix.jpg",
      artist: "Pratband",
    },
    {
      audio_src: "songs/roz.mp3",
      name: "Ramesh",
      image_url: "images/song-art.jpg ",
      artist: "Prats",
    },
  ],
  updateQueue: action((state: any, payload: any) => {
    state.queue = payload;
  }),
});

export { playerStore, type StoreModel };
