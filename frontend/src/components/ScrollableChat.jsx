import React, { useState } from "react";

import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "./Context/chatProvider";
import "./styles.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const user_data = user?.data;

  const getMinutes = (val) => {
    if (val < 10) {
      return `0${val}`;
    } else {
      return val;
    }
  };

  return (
    <ScrollableFeed className="messages">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
            {(isSameSender(messages, m, i, user_data._id) ||
              isLastMessage(messages, i, user_data._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user_data._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user_data._id),
                marginTop: isSameUser(messages, m, i, user_data._id) ? 5 : 10,
                borderRadius: "10px",
                padding: "5px 10px",
                maxWidth: "75%",
                textAlign: "justify",
              }}
            >
              {m?.content}
              <div
                style={{
                  color: "blue",
                  fontSize: "0.9rem",
                  textAlign: m.sender._id === user_data._id && "right",
                }}
              >
                {new Date(m?.createdAt.toString()).getHours()}:
                {getMinutes(new Date(m?.createdAt.toString()).getMinutes())}
              </div>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
