import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const toast = useToast();
  const navigate = useNavigate();
  const [pictureLoading, setpictureLoading] = useState(false);
  const [loginInputValues, setloginInputValues] = useState(initialState);

  const handleInputChange = (e) => {
    setloginInputValues({
      ...loginInputValues,
      [e.target.name]: e.target.value,
    });
  };

  const [show, setShow] = useState(false);
  const handlePasswordIcon = () => {
    setShow(!show);
  };

  const submitLoginHandler = async () => {
    const { email, password } = loginInputValues;
    setpictureLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setpictureLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setpictureLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setpictureLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          placeholder="Enter your Email Address"
          onChange={handleInputChange}
          value={loginInputValues.email}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Enter your Password"
            onChange={handleInputChange}
            value={loginInputValues.password}
          />
          <InputRightElement>
            <Button onClick={handlePasswordIcon}>
              {!show ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={pictureLoading}
        onClick={submitLoginHandler}
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
