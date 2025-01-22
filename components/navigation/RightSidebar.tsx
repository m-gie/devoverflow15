import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in React?", votes: 10 },
  { _id: "2", title: "How to use React Router?", votes: 5 },
  { _id: "3", title: "How to use React Context?", votes: 2 },
  { _id: "4", title: "How to use Redux?", votes: 2 },
  { _id: "5", title: "How to use React Whatever?", votes: 2 },
];

const popularTags = [
  { _id: "1", name: "React", questions: 10 },
  { _id: "2", name: "JavaScript", questions: 5 },
  { _id: "3", name: "TypeScript", questions: 2 },
  { _id: "4", name: "Node.js", questions: 2 },
  { _id: "5", name: "Next.js", questions: 2 },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[360px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={ROUTES.PROFILE(question._id)}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
