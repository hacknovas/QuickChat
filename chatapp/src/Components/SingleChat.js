import { ArrowBackIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { Box, FormControl, IconButton, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModel from './MiscLenous/ProfileModel';
import UpdateGroupChatModal from './MiscLenous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';

export default function SingleChat({ fetchAgain, setfetchAgain }) {
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const toast = useToast();

    useEffect(() => {
        fetchMessage();

    }, [selectedChat]);

    const fetchMessage = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            // console.log(messages);
            setMessages(data);
            setLoading(false);
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
    }

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
                setNewMessage("")
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
    }

    const typingHandler = async (e) => {
        setNewMessage(e.target.value);
    }

    return (
        <>
            {
                selectedChat ?
                    <div>
                        <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" d="flex" justifyContent={{ base: "space-between" }} alignItems="center">

                            <div className="container">

                                <div className="row">
                                    <div className="col-1">
                                        <IconButton icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                                    </div>

                                    {/* <div className="col-7"></div> */}

                                    <div className="col-11">
                                        <div className="container">

                                            <div className="row">
                                                {
                                                    (!selectedChat.isGroupChat ? (
                                                        <>
                                                            <div className="col-11 text-center" >

                                                                {getSender(user, selectedChat.user)}
                                                            </div>
                                                            <div className="col-1">
                                                                <ProfileModel user={getSenderFull(user, selectedChat.user)} />
                                                            </div>

                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="col-11 text-center" >
                                                                {selectedChat.chatName}
                                                            </div>
                                                            <div className="col-1">

                                                                <UpdateGroupChatModal
                                                                    fetchAgain={fetchAgain}
                                                                    setfetchAgain={setfetchAgain}
                                                                    fetchMessage={fetchMessage}

                                                                />
                                                            </div>
                                                        </>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Text>

                        <div >

                            {
                                loading ? <div>Loading</div> :
                                    <div >
                                        <ScrollableChat messages={messages} />
                                    </div>
                            }

                            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                                <Input bg="white" placeholder="Enter a message.." value={newMessage} onChange={typingHandler}
                                />
                            </FormControl>
                        </div>

                    </div>
                    :
                    (
                        <Box className='d-flex justify-content-center row' h="65vh">

                            <Text fontSize="3xl" pb={3} fontFamily="Work sans" className='text-center text-light' >
                                <u>
                                    Start Chatting
                                    <br />
                                </u>
                            </Text>
                        </Box>
                    )
            }
        </>
    )
}
