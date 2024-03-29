import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../UserAvtar/UserListItem";
import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import UserBadegeItem from "../UserAvtar/UserBadegeItem";

export default function UpdateGroupChatModal({
  fetchAgain,
  setfetchAgain,
  fetchMessage,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userVal, setUserVal] = useState("");

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setrenameLoading] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
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
  };

  const handleRename = async () => {
    console.log("updates");
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

      const { data } = await axios.put(
        `/api/chat/rename`,
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
  };

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

      if (data.length == 0) {
        throw new Error("No match");
      }

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "No match found!",
        description: "Search again...",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      });
      setLoading(false);

    }
  };

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
  };

  return (
    <>
      <Button onClick={onOpen}>
        <img src="./three_dots.png" alt="NA" style={{ height: "2vh" }} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="shadow-lg border p-2">
          <div className="btn">
            <b>{selectedChat.chatName}</b>
          </div>
          <hr />
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              <div className="badge text-dark">Group Members:</div>
              <br />
              {selectedChat.user.map((u) => (
                <UserBadegeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl className="d-flex flex-col">
              <Input
                placeholder="Update Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button ml={1} isLoading={renameloading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <br />
            <FormControl className="d-flex flex-col">
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => setUserVal(e)}
              />

              <Button
                ml={1}
                onClick={() => {
                  handleSearch(userVal);
                }}
              >
                Search
              </Button>
            </FormControl>

            {loading ? (
              <div style={{ height: "0vh" }}>Loading</div>
            ) : (
              <div className="overflow-auto" style={{ height: "30vh" }}>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
