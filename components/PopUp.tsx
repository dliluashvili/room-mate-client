import { useState } from "react";
import { Button } from "../@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog";
import popupBack from "../public/newImages/popup.svg";
import Image from "next/image";
import { useRouter } from "next/router";

export function PopUp({ isOpen, setIsOpen, range }) {
  const router = useRouter();
  return (
    <Dialog open={isOpen}>
      <h1 onClick={() => setIsOpen(false)}>Close</h1>
      <DialogContent className="sm:max-w-[425px] flex flex-col rounded-lg overflow-hidden bg-white ">
        <div className="w-full h-40 relative">
          <Image src={popupBack} layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col  gap-2 px-2 md:px-6 text-center pb-2 md:pb-4">
          <span className="text-[red]">
            Thank you for registering! 😊{" "}
            {range && range < 200 && range > 150
              ? "first range"
              : "second range"}
          </span>
          <span>
            lasdlasdasldmklqnefljqe ljqenf nqe nqek fgqeklgn qleng kqneg kqnelgn
            qeklng lqkengk lqengk lnqelkg nqe g
          </span>
          <span>
            lasdlasdasldmklqnefljqe ljqenf nqe nqek fgqeklgn qleng kqneg kqnelgn
            qeklng lqkengk lqengk lnqelkg nqe g
          </span>
          <span>
            lasdlasdasldmklqnefljqe ljqenf nqe nqek fgqeklgn qleng kqneg kqnelgn
            qeklng lqkengk lqengk lnqelkg nqe g
          </span>
          <span>
            lasdlasdasldmklqnefljqe ljqenf nqe nqek fgqeklgn qleng kqneg kqnelgn
            qeklng lqkengk lqengk lnqelkg nqe g
          </span>
          <span>
            lasdlasdasldmklqnefljqe ljqenf nqe nqek fgqeklgn qleng kqneg kqnelgn
            qeklng lqkengk lqengk lnqelkg nqe g
          </span>
          <Button onClick={() => router.push("/")}>agree</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
