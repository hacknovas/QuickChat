import React from 'react';
import HomePage from "./Components/HomePage";
import ChatPage from "./Components/ChatPage";
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <Routes>  
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;