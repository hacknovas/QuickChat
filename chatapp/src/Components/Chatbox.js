import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/chatProvider";
import SingleChat from "./SingleChat";

export default function Chatbox({ fetchAgain, setfetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <>
      <Box
        d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        borderRadius="lg"
        className="border shadow-sm p-3"
      >
        <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
      </Box>
    </>
  );
}
