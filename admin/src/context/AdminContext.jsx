/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
export const AdminContext = createContext();
const ContextProvider = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const value = { isMobile, setIsMobile, collapsed, setCollapsed };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default ContextProvider;
