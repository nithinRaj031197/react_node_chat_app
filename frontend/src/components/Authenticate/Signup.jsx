import {
  Avatar,
  Button,
  Container,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };
  const toast = useToast();
  const navigate = useNavigate();

  const [picture, setpicture] = useState();
  const [pictureLoading, setpictureLoading] = useState(false);

  const [signupInputValues, setSignupInputValues] = useState(initialState);

  const handleInputChange = (e) => {
    setSignupInputValues({
      ...signupInputValues,
      [e.target.name]: e.target.value,
    });
  };

  const [show, setShow] = useState(false);
  const handlePasswordIcon = () => {
    setShow(!show);
  };

  const pictureUpload = (pics) => {
    setpictureLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();

      data.append("file", pics);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", "dejqwayom");

      fetch("https://api.cloudinary.com/v1_1/dejqwayom/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpicture(data.url.toString());
          setpictureLoading(false);
        })
        .catch((err) => {
          setpictureLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const submitFormHandler = async () => {
    const { name, email, password, confirm_password } = signupInputValues;
    setpictureLoading(true);
    if (!name || !email || !password || !confirm_password) {
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
    if (password !== confirm_password) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 3000,
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
        "http://localhost:5000/api/user/create",
        {
          name,
          email,
          password,
          pic: picture,
        },
        config
      );
      toast({
        title: "Registration Successful",
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
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          placeholder="Enter your Name"
          onChange={handleInputChange}
          value={signupInputValues.name}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          placeholder="Enter your Email Address"
          onChange={handleInputChange}
          value={signupInputValues.email}
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
            value={signupInputValues.password}
          />
          <InputRightElement>
            <Button onClick={handlePasswordIcon}>
              {!show ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="confirm_password"
            placeholder="Enter your Confirm Password"
            onChange={handleInputChange}
            value={signupInputValues.confirm_password}
          />
          <InputRightElement>
            <Button onClick={handlePasswordIcon}>
              {!show ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture">
        <FormLabel>Upload Your Picture</FormLabel>
        <InputGroup>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => pictureUpload(e.target.files[0])}
          />
          <InputRightElement>
            <Avatar size="sm" name={signupInputValues?.name} src={picture} />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={pictureLoading}
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitFormHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
