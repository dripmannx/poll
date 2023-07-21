import { GetResult } from "@prisma/client/runtime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";
type Props = {};
dayjs.extend(relativeTime);

const MyPolls = (props: Props) => {
  const [showIcon, setShowIcon] = useState(false);

  const handleMouseEnter = () => {
    setShowIcon(true);
  };

  const handleMouseLeave = () => {
    setShowIcon(false);
  };
  const { data } = api.pollRouter.getPollByUserId.useQuery();
  const router = useRouter();

  return (
    <div className="container">
      <div className=" mt-5 grid grid-cols-3">
        {data?.map((item) => (
          <Link href={`/${item.link}`}>
            <Card
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-pointer hover:shadow-lg dark:hover:border-gray-500"
              key={item.id}
            >
              {" "}
              {showIcon && (
                <div className="absolute right-0 top-0 -mr-4 -mt-4 rounded-full p-2 shadow-lg dark:bg-gray-500">
                  <FaExternalLinkAlt />
                </div>
              )}
              <CardHeader>
                <CardTitle>{item.question} </CardTitle>
                <CardDescription>{item.discription} </CardDescription>
                <CardDescription>
                  {item.choices.length} Antwort Möglichkeiten ·{" "}
                  {dayjs().to(item.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {item.choices.map((choice, index) => (
                  <div key={choice.id} className="flex gap-2 ">
                    <div>
                      {index + 1}. {choice.choiceText}{" "}
                    </div>
                    · <div>{choice.votes.length} Votes</div>
                  </div>
                ))}{" "}
                <CardDescription>
                  Gesamt Votes {getTotalVotes(item)}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-5 text-center">
        <h1> {data?.length} Umfragen</h1>
      </div>
    </div>
  );
};

export default MyPolls;

export const getTotalVotes = (pollData: Poll) => {
  return pollData.choices.reduce(
    (totalVotes, choices) => totalVotes + choices.votes.length,
    0
  );
};
