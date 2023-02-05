import { ChakraProvider, defineStyle, defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Playlist from "./Components/Playlist";
import SongQueue from "./Components/SongQueue";
import JoinPodCastPage from "./Pages/JoinPodCastPage";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";

const outline = defineStyle({
  colorScheme: 'yellow',
  border: '2px dashed', // change the appearance of the border
  borderRadius: 0, // remove the border radius
  fontWeight: 'semibold', // change the font weight
})

const buttonTheme = defineStyleConfig({
  variants: { outline },
})

const theme = extendTheme({
  components: { Button: buttonTheme },
})

function App() {
  return (
    <ChakraProvider theme={theme}>

      <div className="App">
        {/* <BrowserRouter>
        <Routes>
          <Route element={<MainPage />}>
            <Route index element={<div>Hello</div>}></Route>
            <Route path="/" element={<Dashboard album={[]} />}></Route>
            <Route path="/queue" element={<SongQueue />} />
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </BrowserRouter> */}

        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route index element={<Dashboard />}></Route>
              <Route path="playlist" element={<Playlist />}>
                {/* <Route path="/:id" children={ }></Route> */}
              </Route>
              <Route path="library" element={<Dashboard />}></Route>
              <Route path="search" element={<Dashboard />}></Route>
              <Route path="queue" element={<SongQueue songsList={[]} />}></Route>
            </Route>

            <Route path="/podcast" element={<JoinPodCastPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
