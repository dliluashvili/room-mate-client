import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../@/components/ui/accordion";
import QeustionIcon from "../../public/newImages/question-icon.svg";
import Image from "next/image";

const items = [
  { value: "item-1", question: "Question 1", answer: "Answer 1" },
  { value: "item-2", question: "Question 2", answer: "Answer 2" },
  { value: "item-3", question: "Question 3", answer: "Answer 3" },
  // Add more items as needed
];

export function AccordionQuestions() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (value) => {
    setSelectedItem(selectedItem === value ? null : value);
  };

  const bgColor = (value) => (selectedItem === value ? "#DFE6FC" : "#f2f5ff");

  return (
    <main className="px-6 pt-6 pb-12 bg-[#f2f5ff]">
      <h1 className="text-xl font-semibold">ხშირად დასმული კითხვები</h1>
      <Accordion type="single" collapsible className="w-full mt-6">
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            style={{ backgroundColor: bgColor(item.value) }}
            onClick={() => handleClick(item.value)}
          >
            <div className="flex flex-row items-center">
              <div className="w-5 h-5 mr-3 relative">
                <Image src={QeustionIcon} layout="fill" objectFit="cover" />
              </div>
              <AccordionTrigger>{item.question}</AccordionTrigger>
            </div>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
