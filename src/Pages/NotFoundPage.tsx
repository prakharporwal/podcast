import { Box, Heading } from "@chakra-ui/react";

export const NotFoundPage: React.FunctionComponent = (props) => {
  return (
    <Box h={"100vh"} display={"grid"} placeItems="center">
      <Box display={"flex"} alignItems="center" flexDir={"column"}>
        <Heading as={"h2"} color={"red.500"}>
          404
        </Heading>
        <Heading as={"h3"}>Page Not Found</Heading>
      </Box>
    </Box>
  );
};
