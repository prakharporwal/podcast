import { Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const JoinPodCastPage: React.FunctionComponent = (props) => {
  const [meetId, setMeetId] = useState<string>();
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
      </Box>
    </Box>
  );
};
