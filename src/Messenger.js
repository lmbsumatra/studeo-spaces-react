"use client";
import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

const Messenger = () => {
  return (
    <div>
      <FacebookProvider appId="1055141332568092" chatSupport>
        <CustomChat pageId="472319582623972" minimized={true} />
      </FacebookProvider>
    </div>
  );
};

export default Messenger;
