import { Button, FormControl,  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/chatProvider';
import UserBadegeItem from '../UserAvtar/UserBadegeItem';
import UserListItem from "../UserAvtar/UserListItem";

export default function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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

    const handleSubmit = async () => {
        // console.log("clicked")
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            console.log("test");

            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);


            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {

            toast({
                title: "Error ",
                description: "Already Exist user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (userToRemove) => {
        setSelectedUsers(
            selectedUsers.filter(sel => sel._id !== userToRemove._id)
        );
    }


    return (
        <>
            <span onClick={onOpen} style={{"cursor":"pointer"}}>+</span>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >create Grp Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        
                        {
                            selectedUsers.map((user) => (
                                <UserBadegeItem

                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        handleDelete(user);
                                    }}
                                />
                            ))
                        }
                        
                        {/* selected user */}

                        {
                            loading ? <div>Loading</div> : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                            )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
