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
  {
    value: "item-1",
    question: "შემთხვევითად გენერირებული ტექსტი",
    answer:
      "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს. შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს.",
  },
  {
    value: "item-2",
    question: "შემთხვევითად გენერირებული ტექსტი",
    answer:
      "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს. შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს.",
  },
  {
    value: "item-3",
    question: "შემთხვევითად გენერირებული ტექსტი",
    answer:
      "შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს. შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს, შემთხვევითად გენერირებული ტექსტი ეხმარება დიზაინერებს და ტიპოგრაფიული ნაწარმის შემქმნელებს.",
  },
];

export function AccordionQuestions() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (value) => {
    setSelectedItem(selectedItem === value ? null : value);
  };

  const bgColor = (value) => (selectedItem === value ? "#DFE6FC" : "#f2f5ff");

  return (
    <main className="px-6 pt-6 pb-12 bg-[#f2f5ff] sm:px-16 md:px-20 lg:px-24 ">
      <h1 className="text-xl font-semibold">ხშირად დასმული კითხვები</h1>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-6 order rounded-lg border-gray-300 "
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            style={{ backgroundColor: bgColor(item.value) }}
            className="rounded-lg border-gray-300"
          >
            <div
              onClick={() => handleClick(item.value)}
              className="flex flex-row items-center b mt-4 p-4 w-full  rounded-lg border-gray-300 "
              style={{
                border: selectedItem === item.value ? "none" : "1px solid",
              }}
            >
              <div className="w-5 h-5 mr-3 relative">
                <Image src={QeustionIcon} layout="fill" objectFit="cover" />
              </div>
              <div className="w-full">
                <AccordionTrigger className="text-left text-[14px]">
                  {item.question}
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent className="text-left p-4 pt-0 text-xs  leading-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
