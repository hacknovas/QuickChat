import { LineWave } from "react-loader-spinner";
import validator from "validator";

import {
  Button,
  FormControl,
  FormLabel,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [show, setshow] = useState(false);

  const [showWarnE, setshowWarnE] = useState(false);
  const [showWarnP, setshowWarnP] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [confpass, setconfpass] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password || !confpass) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);

      return;
    }

    if (!validator.isEmail(email)) {
      toast({
        title: "Enter Valid Email",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);

      return;
    }

    if (!validator.isStrongPassword(password)) {
      toast({
        title:
          "Password Must be \n minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);

      return;
    }

    if (password !== confpass) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);

      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setTimeout(() => {
        setloading(false);
        navigate("/chats");
      }, 1000);
    } catch (error) {}
  };

  return (
    <>
      <VStack
        className=""
        divider={<StackDivider borderColor="blue.200" />}
        spacing="5px"
        align="stretch"
      >
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <input
            className="p-2 w-100"
            placeholder="Enter Name"
            onChange={(e) => {
              setname(e.target.value);
            }}
          ></input>
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <input
            className="p-2 w-100"
            placeholder="Enter Email"
            type="email"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          ></input>
          <div className={showWarnE ? "badge badge-danger" : "d-none"}>
            Enter Valid Email
          </div>
        </FormControl>

        <FormControl id="_password" isRequired>
          <FormLabel>Password</FormLabel>
          <inputGroup className="d-flex flex-col">
            <div className="w-100">
              <input
                className="p-2 w-100"
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => {
                  setpass(e.target.value);
                }}
              ></input>
            </div>
            <inputRightElement>
              <Button
                onClick={() => {
                  show ? setshow(false) : setshow(true);
                }}
              >
                <i class="fa fa-eye"></i>
              </Button>
            </inputRightElement>
          </inputGroup>
        </FormControl>

        <FormControl id="confirm_password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <inputGroup>
            <input
              className="p-2 w-100"
              type="password"
              placeholder="Enter Password"
              onChange={(e) => {
                setconfpass(e.target.value);
              }}
            ></input>
          </inputGroup>
        </FormControl>

        <p
          className={showWarnP ? "badge text-danger" : "d-none"}
          style={{
            position: "",
            zIndex: "2",
          }}
        >
          <p>
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,
            minSymbols: 1
          </p>
        </p>

        {loading == false ? (
          <Button className="mt-3 text-dark" onClick={submitHandler} disabled>
            SignUp
          </Button>
        ) : (
          <div
            className="w-100"
            style={{ justifyContent: "center", display: "flex" }}
          >
            <LineWave color="grey" ariaLabel="line-wave" visible={true} />
          </div>
        )}
      </VStack>
    </>
  );
}
