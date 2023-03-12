import {
  Avatar,
  AvatarBadge,
  Box,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";

type User = {
  email: string;
  isActive?: boolean;
};

type chatMessage = {
  message: string;
  sender: User;
};

var currentUser: string = "prakhar";

type chatBoxProps = {
  ws: WebSocket;
  roomId: string | undefined;
};

export const ChatBox: React.FunctionComponent<chatBoxProps> = (props) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const websocket = props.ws;
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<chatMessage[]>([
    // {
    //   message: "hey",
    //   sender: { email: "prakhar", isActive: true },
    // },
    // {
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis ex ipsam accusantium! Eligendi velit recusandae assumenda qui error nostrum quisquam cumque labore dolore! Nesciunt, ducimus. Obcaecati animi error adipisci repellat" +
    //     "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
    //   sender: { email: "lolo" },
    // },
    // {
    //   message: "abey",
    //   sender: { email: "Anony" },
    // },
    // {
    //   message: "hey",
    //   sender: { email: "prakhar", isActive: true },
    // },
    // {
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis ex ipsam accusantium! Eligendi velit recusandae assumenda qui error nostrum quisquam cumque labore dolore! Nesciunt, ducimus. Obcaecati animi error adipisci repellat" +
    //     "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
    //   sender: { email: "lolo" },
    // },
    // {
    //   message: "abey",
    //   sender: { email: "Anony" },
    // },
    // {
    //   message: "hey",
    //   sender: { email: "prakhar", isActive: true },
    // },
    // {
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis ex ipsam accusantium! Eligendi velit recusandae assumenda qui error nostrum quisquam cumque labore dolore! Nesciunt, ducimus. Obcaecati animi error adipisci repellat" +
    //     "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
    //   sender: { email: "lolo" },
    // },
    // {
    //   message: "abey",
    //   sender: { email: "Anony" },
    // },
    // {
    //   message: "hey",
    //   sender: { email: "prakhar", isActive: true },
    // },
    // {
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis ex ipsam accusantium! Eligendi velit recusandae assumenda qui error nostrum quisquam cumque labore dolore! Nesciunt, ducimus. Obcaecati animi error adipisci repellat" +
    //     "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
    //   sender: { email: "lolo" },
    // },
    // {
    //   message: "abey",
    //   sender: { email: "Anony" },
    // },
    // {
    //   message: "hey",
    //   sender: { email: "prakhar", isActive: true },
    // },
    // {
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis ex ipsam accusantium! Eligendi velit recusandae assumenda qui error nostrum quisquam cumque labore dolore! Nesciunt, ducimus. Obcaecati animi error adipisci repellat" +
    //     "chal na Naval se Smart toh mein hai! chat bey ~baap~ ko mt *sikha* khud hi toh gum hai be raste mat ddikha",
    //   sender: { email: "lolo" },
    // },
    // {
    //   message: "abey",
    //   sender: { email: "Anony" },
    // },
  ]);

  useEffect(() => {
    websocket.addEventListener("message", (e) => {
      try {
        let msgRecd = JSON.parse(e.data);

        if (msgRecd.Body !== null && msgRecd.Body !== undefined) {
          let msg = JSON.parse(msgRecd.Body);

          if (msg.sender) {
            setChats([...chats, msg]);
          }
        }
      } catch (err) {
        console.log("message recieved parsing went wrong");
      }
    });

    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <Box>
      <Box
        h={"99vh"}
        borderRadius={8}
        border="0.5px solid gray"
        // bgColor={"whitesmoke"}
        bgImage={"linear-gradient(to bottom, #FDFCFB, #E2D1C3)"}
        margin={1}
        pos="relative"
      >
        <Heading
          as="h5"
          size={"md"}
          textAlign="center"
          noOfLines={1}
          textColor={"whitesmoke"}
          bgColor={"blue.600"}
          paddingY={"2"}
          borderRadius={"8px 8px 0px 0px"}
        >
          {props.roomId}
        </Heading>

        <Box
          margin="1"
          height={"88%"}
          overflowY={"auto"}
          style={{ scrollbarWidth: "thin" }}
          // scrollPadding="0"
        >
          {chats.map((chat, idx) => (
            <ChatMessage
              key={idx}
              message={chat.message}
              sender={chat.sender}
            />
          ))}
          <Box ref={bottomRef} display="hidden"></Box>
        </Box>
        <Box
          pos={"absolute"}
          bottom={0}
          display={"flex"}
          gap={1}
          padding={"1px"}
          w="100%"
        >
          <Input
            value={currentMessage}
            fontSize={"sm"}
            bgColor={"white"}
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
      className="chat-message"
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
        bg={"lightyellow"}
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
