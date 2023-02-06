import React, { useState } from 'react';
import { ChatState } from "../Context/chatProvider";
import { Box } from '@chakra-ui/react';
import SideDrawer from "./MiscLenous/SideDrawer";
import MyChats from './MyChats';
import Chatbox from './Chatbox';

export default function ChatPage() {

    const { user } = ChatState();
    const [fetchAgain, setfetchAgain] = useState(false)

    return (
        <div className='d-flex flex-column mb-3' >
            <div className='my-3'>
                {user && <SideDrawer />}
            </div>
            <div className='my-3'>
                <div className="container">
                    <div className="row">

                        <div className="col-4">
                            {user && <MyChats fetchAgain={fetchAgain} />}
                        </div>
                        <div className="col-8">
                            {user && <Chatbox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
