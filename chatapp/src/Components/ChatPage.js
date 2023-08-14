import React, { useState } from "react";
import { ChatState } from "../Context/chatProvider";
import SideDrawer from "./MiscLenous/SideDrawer";
import MyChats from "./MyChats";
import Chatbox from "./Chatbox";
import Footer from "./Footer";

export default function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setfetchAgain] = useState(false);

  return (
    <div className="d-flex flex-column flex-wrap">
      <div className="">{user && <SideDrawer />}</div>
      <div className="m-3">
        <div className="d-flex ">
          <div
            className="m-1 overflow-y-auto"
            style={{ flexGrow: "1", height: "75vh" }}
          >
            {user && <MyChats fetchAgain={fetchAgain} />}
          </div>
          <div
            className="m-1 overflow-y-auto"
            style={{ flexGrow: "4", height: "75vh" }}
          >
            {user && (
              <Chatbox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

