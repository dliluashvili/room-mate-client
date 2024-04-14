import React from "react";
import { BaseInput } from "../../@/components/ui/input";

export default function List() {
  return (
    <section className="flex flex-col w-1/5 h-full">
      <div className="flex p-4 flex-row items-center justify-center w-full">
        <BaseInput placeholder="search" />
      </div>
      <div className="flex flex-row items-center gap-2 justify-start px-4 py-2">
        <span>chat</span>
        <span>request</span>
      </div>
      <div className="h-1 w-full bg-slate-400"></div>
      <div className="flex flex-col items-center py-2">
        <div>Lado ASambadze</div>
        <div>Lado ASambadze</div>
        <div>Lado ASambadze</div>
        <div>Lado ASambadze</div>
        <div>Lado ASambadze</div>
      </div>
    </section>
  );
}
