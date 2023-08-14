import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/chatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from "../ChatLoading";
import UserListItem from '../UserAvtar/UserListItem';

export default function SideDrawer() {

    const navigate = useNavigate();
    const [search, setSearch] = useState()
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState(false);

    const { user, setSelectedChat, chats, setchats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    }

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSearch = async () => {

        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }

        try {
            setloading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setloading(false);
            setsearchResult(data);
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

    const accessChat = async (userId) => {

        try {
            setloadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`/api/chat`, { userId }, config);

            setSelectedChat(data);
            setloadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }

    }

    return (
        <>
            <div className="d-flex flex-wrap" >
                <div className=" container-fluid text-center bg-light shadow py-2 mb-2 rounded" >
                    <div className="d-flex flex-wrap align-items justify-content-evenly">
                        <div className="me-auto d-flex"style={{cursor:"pointer"}}>
                                <img src="./logo.png" alt="Talk-A-Tive" style={{ "height": "8vmin", display: "inline" }} />
                                <div className="container mt-3">Talk@Tive</div>
                        </div>

                        <div className="mx-1">

                            <Tooltip label="Search Users to chat" >
                                <Button variant="ghost" onClick={onOpen}>
                                    <i className="fas fa-search"></i>
                                    <Text d={{ base: "none", md: "flex" }} >
                                        Search Freinds
                                    </Text>
                                </Button>
                            </Tooltip>
                        </div>




                        <div className='mx-1'>
                            {/* <Menu>
                                <MenuButton p={1}>
                                    <BellIcon fontSize="2xl" m={1} />
                                    Bell Icon
                                </MenuButton>

                            </Menu> */}
                            {/* // */}
                            <Menu>
                                <MenuButton as={Button} bg="white" rightIcon={""}>
                                    <Avatar
                                        size="sm"
                                        cursor="pointer"
                                        name={user.name}
                                        src={user.pic}
                                    />
                                </MenuButton>
                                <MenuList>
                                    <ProfileModel user={user}>
                                        <MenuItem>My Profile</MenuItem>{" "}
                                    </ProfileModel>
                                    <MenuDivider />
                                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box pb={2} className="container mx-0">
                            <div className="row">

                                <Input
                                    placeholder="Search by name or email"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </div>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) :
                            (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
