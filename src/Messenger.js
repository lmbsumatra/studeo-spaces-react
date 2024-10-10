"use client";
import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

const Messenger = () => {
  return (
    <div>
      <FacebookProvider appId="2912179502269599" chatSupport>
        <CustomChat pageId="472319582623972" minimized={true} />
      </FacebookProvider>
    </div>
  );
};

export default Messenger;
