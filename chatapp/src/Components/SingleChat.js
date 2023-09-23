import { ArrowBackIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { Box, FormControl, IconButton, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./MiscLenous/ProfileModel";
import UpdateGroupChatModal from "./MiscLenous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "/";
var socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setfetchAgain }) {
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id != newMessageRecieved.chat._id
      ) {
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessage();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log(messages);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        // console.log("done");
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);

        socket.emit("new Message", data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <div>
          <Text fontFamily="Work sans">
            <div className="d-flex flex-wrap justify-content-between">
              <div>
                <IconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => setSelectedChat("")}
                />
              </div>

              <div className="d-flex flex-wrap justify-content-center ">
                {!selectedChat.isGroupChat ? (
                  <div>
                    <div className="mx-2 py-2 d-flex">
                      <b>
                        <div>{getSender(user, selectedChat.user)}</div>
                      </b>
                      <div>
                        <ProfileModel
                          user={getSenderFull(user, selectedChat.user)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mx-2 py-2 text-center">
                      <b>{selectedChat.chatName}</b>
                    </div>
                    <div className="">
                      <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setfetchAgain={setfetchAgain}
                        fetchMessage={fetchMessage}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </Text>

          <div>
            {loading ? (
              <div
                className="text-light text-center"
                style={{ height: "50vh" }}
              >
                Loading
              </div>
            ) : (
              <div>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              <Input
                bg="white"
                placeholder="Type a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </div>
        </div>
      ) : (
        <Box className="d-flex justify-content-center row">
          <Text pb={3} fontFamily="Work sans" className="text-center ">
            Say Hello..!
            <br />
            Click on chats to start... Search Freinds Here
          </Text>
        </Box>
      )}
    </>
  );
}
