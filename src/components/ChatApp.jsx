import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import axios from 'axios';

const socket = io("http://localhost:3000");

function ChatApp() {
  const [username, setUsername] = useState(localStorage.getItem("userid"));
  const [room, setRoom] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const[chatNames,setchatNames]=useState([]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    socket.on("message", (msg) => setMessages((ms) => [...ms, msg]));
    socket.on("noty", (m) => alert(m));
    return () => {
      socket.off("message");
      socket.off("noty");
    };
  }, []);

  useEffect(() => {
    // Define async function inside useEffect
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chats/manish123`);
        //console.log(response.data)
        setchatNames(response.data);   // Store response data in state
        
      } catch (err) {
        console.log(err);
        
      }
    };
    
    fetchData();
  }, []);

  // Join room and fetch history
  const handleJoin = async () => {
    if (!username.trim() || !room.trim()) {
      alert("Enter both username and room name.");
      return;
    }
    socket.emit("joinRoom", room, username);

    try {
      const res = await fetch(`http://localhost:3000/messages/${room}`);
      if (!res.ok) throw new Error("Failed to load history");
      const history = await res.json();
      setMessages(history);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // Leave room
  const handleLeave = () => {
    if (room.trim()) {
      socket.emit("leaveRoom", room);
      setMessages([]);
    }
  };

  // Send message
  const sendMsg = () => {
    if (!username.trim() || !room.trim() || !inputMsg.trim()) return;
    socket.emit("roomMessage", {
      userName: username,
      roomName: room,
      message: inputMsg,
    });
    setInputMsg("");
  };

  // Handle enter key for sending
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMsg();
  };

  return (
    <div className="main-chat">
      <h2>Chat Application</h2>
      <div className="controls">
        <input
          id="user"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          id="roomInput"
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button id="joinBtn" onClick={handleJoin}>Join</button>
        <button id="leaveBtn" onClick={handleLeave}>Leave</button>
      </div>

      <ul id="messages">
        {messages.map((msg, idx) => {
          const isSystem = msg.userName === username;
          return (
            <li
              key={idx}
              className={`message ${isSystem ? "system" : "notsystem"}`}
            >
              {msg.userName}: {msg.message}
            </li>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>

      <div className="input-container">
        <input
          id="messageInput"
          type="text"
          placeholder="Type a message"
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button id="sendBtn" onClick={sendMsg}>Send</button>
        {chatNames.map((names,idx)=>{return(<div key={idx}>{names.chat_name}</div>)})}
      </div>
    </div>
  );
}

export default ChatApp;
