import { GetResult } from "@prisma/client/runtime";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BarLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
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
  const {
    data,
    isLoading,
    isError,
    error: pollError,
  } = api.pollRouter.getPollByUserId.useQuery();
  const router = useRouter();
  if (isError) {
    return (
      <div className="container mt-5">
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{pollError.message}</AlertDescription>
          <Button className="mt-5" onClick={() => router.push("/new")}>
            Neue Umfrage erstellen
          </Button>
        </Alert>
      </div>
    );
  }
  return (
    <div className="container">
      {" "}
      {isLoading && <BarLoader />}
      <div className=" mt-5 grid grid-cols-3 gap-4">
        {data?.map((item) => (
          <Link key={item.id} href={`/${item.link}`}>
            <Card
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative  cursor-pointer hover:shadow-lg dark:hover:border-gray-500"
            >
              {" "}
              {showIcon && (
                <div className="absolute right-0 top-0 -mr-4 -mt-4 rounded-full p-2 shadow-lg dark:bg-white">
                  <FaExternalLinkAlt color="black" />
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
const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
      </div>
    </div>
  );
};
