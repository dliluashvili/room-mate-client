import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../@/components/ui/sheet";

import Image from "next/image";
import BurgerIcon from "../public/newImages/burger-menu.svg";
import Link from "next/link";
import { useTypedSelector } from "./hooks/useTypeSelector";

export default function BurgerMenu() {
  const { user } = useTypedSelector((state) => state.profile);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image src={BurgerIcon} />
      </SheetTrigger>
      <SheetContent className="px-6 pt-3 pb-14 bg-[#F2F5FF] flex flex-col items-start w-72">
        <p className="text-base">en</p>
        <div className="flex flex-col gap-y-6 mt-16 text-xs">
          <Link href="/">
            <p>მთავარი</p>
          </Link>
          <Link href={user ? "/search" : "/signup"}>
            <p>იპოვე ოთახის მეზობელი</p>
          </Link>
          <Link href="/houseSearch">
            <p>იპოვე ბინა</p>
          </Link>

          <p>გახდი ჩვენი პარტნიორი</p>
          <p>ხშირად დასმული შეკითხვები</p>
          <p>როგორ მუშაობს</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
