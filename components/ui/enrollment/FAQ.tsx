import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string | string[]; // Updated type to support both formats
}

interface FAQProps {
  title: string;
  items: FAQItem[];
}

export default function FAQ({ title, items }: FAQProps) {
  console.log(items, "faq")
  return (
    <section className="flex justify-start mt-8">
      <div className="w-[95%] mx-auto px-4">
        <h4 className="font-bold text-center text-[#3b3b3b] md:my-6">
          {title}
        </h4>
        <Accordion
          type="single"
          collapsible
          className="md:space-y-8 space-y-2 my-4"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-white-300 rounded-lg"
            >
              <AccordionTrigger className="text-[#313131] md:py-4 md:px-8 px-2 bg-gray-200 rounded-lg hover:bg-gray-200 transition-colors text-left">
                <p>{item.question}</p>
              </AccordionTrigger>
              <AccordionContent className="md:p-6 p-2 text-[#313131] bg-gray-50 border-t border-gray-200 rounded-b-md">
                {Array.isArray(item.answer) ? (
                  <div className="list-disc pl-5 space-y-2">
                    {item.answer.map((point, i) => (
                      <p key={i}>{point}</p>
                    ))}
                  </div>
                ) : (
                  <p>{item.answer}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
