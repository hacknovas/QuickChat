import {
  Button,
  FormControl,
  useToast,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [show, setshow] = useState(false);

  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submitHandler = async () => {
    console.log(email, password);
    setloading(true);
    if (!email || !password) {
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

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing="5px"
      align="stretch"
    >
      <FormControl id="_email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder={password}
            type={show ? "text" : "password"}
            onChange={(e) => {
              setpass(e.target.value);
            }}
          ></Input>
          <InputRightElement>
            <Button
              onClick={() => {
                show ? setshow(false) : setshow(true);
              }}
            >.</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button className=" text-dark" onClick={submitHandler}>
        Sign in
      </Button>
    </VStack>
  );
}
