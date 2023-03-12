import { Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Constants from "../Components/Constants";

export const JoinPodCastPage: React.FunctionComponent = (props) => {
  const [meetId, setMeetId] = useState<string>();

  async function getNewRoomId(): Promise<string> {
    let newRoomId = "error";

    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(Constants.API + "/room/new", options)
      .then((res) => {
        if (res.ok) return res.json();
        else throw res;
      })
      .then((data) => {
        console.log(data.room_id);
        setMeetId(Constants.API + "/" + data.room_id);
        newRoomId = data.room_id;
      })
      .catch((err) => {
        throw err;
      });

    return newRoomId;
  }

  const navigate = useNavigate();
  return (
    <Box width={"100vw"} height={"100vh"} display={"grid"} placeItems="center">
      <Box
        w="50%"
        display={"flex"}
        flexDirection="column"
        alignItems={"center"}
        gap={8}
      >
        <Box>Podcasting is a cake walk now!</Box>
        <Input
          w="50%"
          value={meetId}
          onChange={(e) => setMeetId(e.target.value)}
          placeholder="https://meet.podcastly.com/abx-cts"
        ></Input>
        <Link to={"/podcast/" + meetId}>
          <Button colorScheme="yellow">Join</Button>
        </Link>
        <Button
          onClick={async () => {
            let room = await getNewRoomId();
            console.log("idfahr", room);
            navigate("/podcast/" + room);
          }}
        >
          New Room
        </Button>
      </Box>
    </Box>
  );
};
