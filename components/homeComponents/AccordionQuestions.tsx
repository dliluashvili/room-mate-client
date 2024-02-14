import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../@/components/ui/accordion";


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
  const [openItems, setOpenItems] = useState({});

  const handleClick = (value) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [value]: !prevOpenItems[value], // Toggle the state of the clicked item
    }));
  };

  const bgColor = (value) => (openItems[value] ? "#DFE6FC" : "#f2f5ff");

  return (
    <main className="px-6 pt-6 pb-12 bg-[#f2f5ff] sm:px-16 md:px-20 lg:px-24 ">
      <h1 className="text-xl font-semibold">ხშირად დასმული კითხვები</h1>
      {items.map((item) => (
        <Accordion
          type="single"
          collapsible
          className="w-full mt-6 order rounded-lg border-gray-300 "
        >
          <AccordionItem
            key={item.value}
            value={item.value}
            style={{ backgroundColor: bgColor(item.value) }}
            className="rounded-lg border-gray-300"
          >
            <div
              onClick={() => handleClick(item.value)}
              className="flex flex-row items-center  w-full  rounded-lg border-gray-300  "
            >
              <div className="w-full ">
                <AccordionTrigger className="text-left text-[14px] justify-start ">
                  {item.question}
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent className="text-left p-4 pt-0 text-xs  leading-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </main>
  );
}
