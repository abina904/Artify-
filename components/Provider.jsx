"use client";

import { SessionProvider } from "next-auth/react"; // If using NextAuth.js
import { Provider as ReduxProvider } from "react-redux";
import store from "../redux/store"; // Ensure this path is correct

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </SessionProvider>
  );
};

export default Provider;
