import { TabPanels, TabPanel, Tab, TabList, Tabs } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Authentication/Login";
import SignUp from "../Authentication/SignUp";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div
        className=" d-flex align-items-center justify-content-center  "
        style={{ height: "100vh", backgroundColor: "" }}
      >
        <div className="px-10  shadow-lg rounded p-5">
          <Tabs variant="soft-rounded" colorScheme="gray">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <br />
            <hr className="text-light" />
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </>
  );
}
