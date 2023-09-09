import { LineWave } from "react-loader-spinner";

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
      setloading(false);

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
        </FormControl>

        <FormControl id="_password" isRequired>
          <FormLabel>Password</FormLabel>
          <inputGroup className="d-flex flex-col">
            <div>
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

        {/* <FormControl id='pics'>
                    <FormLabel>
                        <input type="file" accept='image/' onChange={(e) => {
                            postDetails(e.target.files[0]);
                        }}>
                        </input>
                    </FormLabel>
                </FormControl> */}

        {loading == false ? (
          <Button className="mt-3 text-dark" onClick={submitHandler}>
            SignUp
          </Button>
        ) : (
          <div className="w-100">
            <LineWave color="grey" ariaLabel="line-wave" visible={true} />
          </div>
        )}
      </VStack>
    </>
  );
}
