import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import Chatbox from "../components/Chatbox";
import { ChatState } from "../components/Context/chatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";

const Chats = () => {
  const { user } = ChatState();
  const user_data = user?.data;

  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user_data && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="5">
        {user_data && <MyChats fetchAgain={fetchAgain} />}
        {user_data && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
