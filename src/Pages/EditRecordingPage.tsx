import { Box, IconButton } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { RiScissorsFill } from "react-icons/ri";

const EditRecordingPage: React.FunctionComponent = (props: any) => {
  useEffect(() => {
    document.title = "Edit Podcast";
  }, []);
  return (
    <Box bg="red" bgColor={"lightyellow"}>
      <IconButton
        aria-label="Trim Recording"
        icon={<RiScissorsFill />}
        title="Trim"
      >
        Trim
      </IconButton>

      <Box width={"100vw"} h="100" bg={"gray"}>
        Audio Graph
      </Box>
    </Box>
  );
};

export { EditRecordingPage };
