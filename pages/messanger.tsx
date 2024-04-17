import React, { useState } from "react";
import List from "../components/messangerComponents/List";
import NewHeader from "../components/NewHeader";
import ChatField from "../components/messangerComponents/ChatField";
import { useCheckAuth } from "../components/hooks/useCheckAuth";
import ChatFieldMobile from "../components/messangerComponents/ChatFieldMobile";

export default function messanger() {
  // useCheckAuth();
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  console.log(mobileOpen);
  return (
    <main className="w-full flex flex-col  h-screen   overflow-hidden  ">
      <NewHeader />
      <div className=" relative flex flex-row md:pt-6 h-full overflow-hidden      md:px-20  xl:px-24   bg-[#F5F5F5] flex-grow ">
        <List
          setUser={setUser}
          request={request}
          setRequest={setRequest}
          setMobileOpen={setMobileOpen}
        />
        <ChatField user={user} request={request} />
        <ChatFieldMobile
          user={user}
          request={request}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>
    </main>
  );
}
