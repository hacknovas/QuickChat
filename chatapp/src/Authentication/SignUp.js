import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [show, setshow] = useState(false);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [confpass, setconfpass] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  let postDetails = (pics) => {
    // setloading(true);
    // if (pic === undefined) {
    //     toast({
    //         title: 'Please Select IMG.',
    //         status: "Warning.",
    //         duration: 5000,
    //         isClosable: true,
    //         position: "bottom"
    //     })
    // }
  };

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
      return;
    }
    if (password !== confpass) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats");
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
          <Input
            placeholder="Enter Name"
            onChange={(e) => {
              setname(e.target.value);
            }}
          ></Input>
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Email"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          ></Input>
        </FormControl>

        <FormControl id="_password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Pass"
              onChange={(e) => {
                setpass(e.target.value);
              }}
            ></Input>
            <InputRightElement>
              <Button
                onClick={() => {
                  show ? setshow(false) : setshow(true);
                }}
              ></Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm_password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type="password"
              placeholder="Enter Pass"
              onChange={(e) => {
                setconfpass(e.target.value);
              }}
            ></Input>
          </InputGroup>
        </FormControl>

        {/* <FormControl id='pics'>
                    <FormLabel>
                        <Input type="file" accept='image/' onChange={(e) => {
                            postDetails(e.target.files[0]);
                        }}>
                        </Input>
                    </FormLabel>
                </FormControl> */}

        <Button className="mt-3 text-dark" onClick={submitHandler}>
          SignUp
        </Button>
      </VStack>
    </>
  );
}
