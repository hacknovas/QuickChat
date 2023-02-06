import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../config/ChatLogic';
import { ChatState } from '../Context/chatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './MiscLenous/GroupChatModal';

export default function MyChats({ fetchAgain }) {
  const { chats, setchats, setSelectedChat, selectedChat, user, setuser } = ChatState();

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

    <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }} >

      <Box
        p={2}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" className="text-light">
          <div className="container">
            <div className="row">

              <div className="col-8">
                My Chats
              </div>
              <div className="col-4">

                <GroupChatModal>
                  <Button
                    d="flex"
                    rightIcon={<AddIcon />}
                  >
                    New Group Chat
                  </Button>
                </GroupChatModal>
              </div>
            </div>
          </div>
        </Box>

        {/* ///// */}

        {chats ? (
          <div className="overflow-y-auto" style={{ "height": "58.5vh" }}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                my={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {
                    !chat.isGroupChat
                      ? getSender(user, chat.user)
                      : chat.chatName
                  }
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))
            }
          </div>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}
