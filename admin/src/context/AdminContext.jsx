/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import io from "socket.io-client";
export const AdminContext = createContext();
const s = io(`https://backend-quizz-deploy.onrender.com`, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});
const ContextProvider = (props) => {
  const [socket, setSocket] = useState(s);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const value = {
    isMobile,
    setIsMobile,
    collapsed,
    setCollapsed,
    socket,
    setSocket,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default ContextProvider;
