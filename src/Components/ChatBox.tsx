import {
  Avatar,
  AvatarBadge,
  Box,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { ws } from "../websocket/Websocket";

type User = {
  email: string;
  isActive?: boolean;
};

type chatMessage = {
  message: string;
  sender: User;
};

var currentUser: string = "prakhar";

export const ChatBox: React.FunctionComponent = (props: any) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chats, setChats] = useState<chatMessage[]>([
    {
      message: "hey",
      sender: { email: "prakhar", isActive: true },
    },
    {
      message:
        "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
      sender: { email: "lolo" },
    },
    {
      message: "abey",
      sender: { email: "Anony" },
    },
  ]);

  let websocket: WebSocket = ws;

  useEffect(() => {
    websocket.addEventListener("message", (e) => {
      try {
        let msgRecd = JSON.parse(e.data);
        if (msgRecd.Body !== null && msgRecd.Body !== undefined) {
          let msg = JSON.parse(msgRecd.Body);
          setChats([...chats, msg]);
        }
      } catch (err) {
        console.log("message recieved parsing went wrong");
      }
    });
  }, [websocket, chats]);

  function sendMessage() {
    setCurrentMessage(currentMessage.trim());

    if (currentMessage.length > 0) {
      let userMessage: chatMessage = {
        message: currentMessage,
        sender: { email: currentUser },
      };

      // setChats([...chats, userMessage]);

      let jsonString = JSON.stringify(userMessage);

      try {
        websocket.send(jsonString);
      } catch (err) {
        console.error("failed message sending", err);
      }

      setCurrentMessage("");
    }
  }

  return (
    <Box pos="fixed" left={0} display={"none"}>
      <Box
        h={"99vh"}
        w={"20rem"}
        borderRadius={8}
        border="0.5px solid gray"
        margin={1}
        pos="relative"
      >
        <Heading as="h4" size={"md"} textAlign="center" noOfLines={1}>
          Joe Rogan Naval #1906
        </Heading>

        <Box marginX={1} bgColor={"green.200"}>
          {chats.map((chat, idx) => (
            <ChatMessage
              key={idx}
              message={chat.message}
              sender={chat.sender}
            />
          ))}
        </Box>
        <Box
          pos={"absolute"}
          bottom={0}
          display={"flex"}
          gap={1}
          padding={1}
          w="100%"
        >
          <Input
            value={currentMessage}
            fontSize={"sm"}
            placeholder="Hey People! Just Enjoying the podcast"
            onChange={(e) => {
              setCurrentMessage(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
                return;
              }
            }}
          ></Input>
          <IconButton
            aria-label="Send Message"
            icon={<MdSend />}
            onClick={sendMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ChatMessage: React.FunctionComponent<chatMessage> = ({
  message,
  sender,
}) => {
  return (
    <Box
      display={"flex"}
      flexDir={"row"}
      gap={1}
      justifyContent={sender.email === currentUser ? "flex-end" : "flex-start"}
    >
      <Avatar name={sender.email} size="sm">
        <AvatarBadge
          boxSize="1.25em"
          bg={sender.isActive ? "green.400" : "red.400"}
        />
      </Avatar>
      <Box
        w="70%"
        bg="lightYellow"
        border={"0.5px solid gray"}
        borderRadius={8}
        padding={2}
        marginY={1}
      >
        <Text fontSize={"sm"}>{message}</Text>
      </Box>
    </Box>
  );
};
