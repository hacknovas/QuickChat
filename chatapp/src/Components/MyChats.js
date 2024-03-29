import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { getSender } from "../config/ChatLogic";
import { ChatState } from "../Context/chatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./MiscLenous/GroupChatModal";

export default function MyChats({ fetchAgain }) {
  const { chats, setchats, setSelectedChat, selectedChat, user } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config, { new: true });
      setchats(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="" >
      <Box className="border shadow-sm p-2 rounded ">
        <div className="d-flex">
          <div className="badge mt-2 text-secondary text-start w-100"><b>My Chats</b></div>
          <div className="btn text-dark ">
            <GroupChatModal>
              <Button d="flex" rightIcon={<AddIcon />}></Button>
            </GroupChatModal>
          </div>
        </div>

        {chats ? (
          <div className="overflow-y-auto" style={{ height: "62vh" }}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "" : "lightyellow"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                my={2}
                borderRadius="lg"
                key={chat._id}
                className="border shadow-lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.user)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text className="badge text-dark" wordBreak={true}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    <span>
                      {chat.latestMessage.content.length > 10
                        ? chat.latestMessage.content.substring(0, 10) + "..."
                        : chat.latestMessage.content}
                    </span>
                  </Text>
                )}
              </Box>
            ))}
          </div>
        ) : (
          // <ChatLoading />
          ""
        )}
      </Box>
    </div>
  );
}
