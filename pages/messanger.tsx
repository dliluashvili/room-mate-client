import React from "react";
import List from "../components/messangerComponents/List";
import NewHeader from "../components/NewHeader";

export default function messanger() {
  return (
    <>
      <NewHeader />
      <main className="flex flex-row pt-6 px-24 pb-32">
        <List />
      </main>
    </>
  );
}
