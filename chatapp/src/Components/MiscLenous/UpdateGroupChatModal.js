import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useDisclosure, useToast } from '@chakra-ui/react'
import axios from "axios";
import UserListItem from "../UserAvtar/UserListItem";
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import UserBadegeItem from '../UserAvtar/UserBadegeItem';

export default function UpdateGroupChatModal({ fetchAgain, setfetchAgain, fetchMessage }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setrenameLoading] = useState(false);

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: userToRemove._id,
                },
                config
            );

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setfetchAgain(!fetchAgain);
            fetchMessage();
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const handleRename = async () => {
        console.log("updates")
        if (!groupChatName) {
            return;
        }

        try {
            setrenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // console.log(data);


            setSelectedChat(data);
            setfetchAgain(!fetchAgain);
            setrenameLoading(false);


        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setrenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {

        setSearch(query);
        if (!query) {
            return;
        }

        try {

            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    }

    const handleAddUser = async (AddUser) => {
        if (selectedChat.user.find((u) => u._id === AddUser._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {

            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: AddUser._id,
                },
                config
            );

            setSelectedChat(data);
            setfetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }

    }

    return (
        <>
            <Button onClick={onOpen}>
                <img src="./three_dots.png" alt="NA" style={{ "height": "20px" }} />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <hr />
                    <ModalCloseButton />
                    <ModalBody>

                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.user.map((u) => (
                                <UserBadegeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl className='d-flex flex-col'>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="blue"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <br />
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>


                        {
                            loading ? <div style={{"height":"0vh"}}>Loading</div> :
                                <div className="overflow-auto" style={{"height":"30vh"}}  >
                                    {
                                    (
                                        searchResult?.slice(0, 4).map((user) => (
                                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                        ))
                                    )
                                }
                                </div>
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
