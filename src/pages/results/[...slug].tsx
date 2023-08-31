import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Chart } from "react-google-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

import { Choice } from "@prisma/client";
import "dayjs/locale/de";

import { ApiError } from "next/dist/server/api-utils";
import { AiOutlineCheck } from "react-icons/ai";
import { BsClipboard2 } from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import Spinner from "~/components/ui/spinner";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";
dayjs.extend(relativeTime);
dayjs.locale("de");
const PollResults = () => {
  const router = useRouter();
  const slug = router.query.slug || [];
  const id = slug[0] as string;

  const { data, isLoading } = api.pollRouter.getVotesByPollId.useQuery(
    { pollId: id },
    { enabled: id ? true : false, retry: false }
  );

  if (data)
    return (
      <>
        <div className="mt-5 lg:container ">
          {isLoading && <Spinner />}

          <React.Fragment key={data.id}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{data.question} </CardTitle>
                <CardDescription>{data.discription} </CardDescription>
                <CardDescription>
                  {data.choices?.length} Antwort Möglichkeiten ·{" "}
                  {dayjs().to(data.createdAt)} · Deadline:{" "}
                  {data.expiredAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>{" "}
              <CardContent>
                <div className=" flex flex-col gap-y-5 lg:flex-row">
                  <BarChart poll={data} />

                  <ChartComp poll={data} />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-5">
              <CardHeader>
                <CardTitle>Teilen</CardTitle>
                <CardDescription>Teile die Umfrage</CardDescription>
              </CardHeader>
              <CardContent>
                <ClipBoard linkToCopy={`https://dripmann.de/${data.link}`} />{" "}
              </CardContent>
            </Card>
            {/* <UsersWhoVoted pollId={id} /> */}
          </React.Fragment>
        </div>
      </>
    );
};
export default PollResults;

interface IChartComp {
  poll: Poll;
}
const createArrayFromObject = (data: Poll): Array<[string, number]> => {
  const resultArray: Array<[string, number]> = [["Task", 0]];

  data.choices.forEach((choice) => {
    const task: string = choice.choiceText;
    const votes: number = choice.votes.length;
    resultArray.push([task, votes]);
  });

  return resultArray;
};
export const options = {
  pieSliceText: "label",
  legend: "none",
  backgroundColor: "transparent",
  chartArea: { top: 0, bottom: 0, left: 0, right: 0 },
};

const ChartComp = ({ poll }: IChartComp) => {
  const result: Array<[string, number]> = createArrayFromObject(poll);

  if (result)
    return (
      <Chart
        className="mt-0"
        chartType="PieChart"
        loader={<Skeleton className=" w-10 rounded-full"></Skeleton>}
        data={[["Task", "Hours per Day"], ...result]}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    );
};

interface IClipBoardProps {
  linkToCopy: string;
}
export function ClipBoard({ linkToCopy }: IClipBoardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast({
        duration: 3000,
        title: "Link Kopiert",
      });
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  return (
    <div className="relative ">
      <Input
        onClick={handleCopyClick}
        value={linkToCopy}
        readOnly
        label=""
        type="text"
        className="h-12 w-full rounded-md border py-2  pr-2"
      />

      <button
        type="button"
        className="absolute right-0 top-0 h-full p-2 text-gray-400 hover:text-gray-600"
      >
        <div className="rounded-sm p-2 hover:bg-accent">
          {" "}
          {isCopied ? <AiOutlineCheck /> : <BsClipboard2 />}
        </div>
      </button>
    </div>
  );
}

type TBarChartProps = {
  poll: Poll;
};
function countTotalVotesInPoll(poll: Poll): number {
  let totalVotes = 0;

  for (const choice of poll.choices) {
    totalVotes += choice.votes.length;
  }

  return totalVotes;
}

const BarChart = ({ poll }: TBarChartProps) => {
  const [votesCount, setVotesCount] = useState(countTotalVotesInPoll(poll));

  return (
    <div className="flex w-full flex-col gap-5">
      {poll.choices.map((choice) => (
        <div key={choice.id} className=" flex flex-col gap-2 ">
          <div className="flex justify-between">
            <Label>{choice.choiceText}</Label>
            <Label>
              {(choice.votes.length / votesCount) * 100}%{" "}
              {`(${choice.votes.length} Stimmen)`}
            </Label>
          </div>
          <Progress
            className="h-5"
            value={(choice.votes.length / votesCount) * 100}
          >
            awd
          </Progress>
        </div>
      ))}{" "}
      <Separator className="mt-2"></Separator>
      <div className="text-center lg:text-left">
        Stimmen insgesamt: {votesCount}
      </div>
    </div>
  );
};

type Props = { pollId: string };

export const UsersWhoVoted = ({ pollId }: Props) => {
  const Users = api.pollRouter.getUsersWhoVotedForPoll.useQuery(
    { pollId: pollId },
    { enabled: pollId ? true : false, retry: false }
  );
  if (Users.isError) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>
          Alle User die bei deiner Umfrage abgestimmt haben
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
