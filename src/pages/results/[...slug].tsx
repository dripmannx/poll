import { Cross2Icon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { BarLoader, CircleLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

import "dayjs/locale/de";
import { CheckCheckIcon } from "lucide-react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { BsClipboard2 } from "react-icons/bs";
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

  return (
    <>
      <div className="container mt-5 ">
        {isLoading && <Spinner />}
        {data?.map((vote) => (
          <>
            <Card key={vote.id} className=" ">
              <CardHeader>
                <CardTitle>{vote.question} </CardTitle>
                <CardDescription>{vote.discription} </CardDescription>
                <CardDescription>
                  {vote.choices.length} Antwort Möglichkeiten ·{" "}
                  {dayjs().to(vote.createdAt)}
                </CardDescription>
              </CardHeader>{" "}
              <ChartComp poll={data} />
            </Card>
            <Card className="mt-5">
              <CardHeader>
                <CardTitle>Teilen</CardTitle>
                <CardDescription>Teile die Umfrage</CardDescription>
              </CardHeader>
              <CardContent>
                <ClipBoard linkToCopy={`https://dripmann.de/${vote.link}`} />{" "}
              </CardContent>
            </Card>
          </>
        ))}{" "}
      </div>
    </>
  );
};
export default PollResults;

interface IChartComp {
  poll: Poll[];
}
const createArrayFromObject = (data: Poll[]): Array<[string, number]> => {
  const resultArray: Array<[string, number]> = [["Task", 0]];

  data.forEach((poll) => {
    poll.choices.forEach((choice) => {
      const task: string = choice.choiceText;
      const votes: number = choice.votes.length;
      resultArray.push([task, votes]);
    });
  });

  return resultArray;
};
export const options = {
  pieSliceText: "label",
  legend: "none",
  backgroundColor: "transparent",
};

const ChartComp = ({ poll }: IChartComp) => {
  const result: Array<[string, number]> = createArrayFromObject(poll);

  if (result)
    return (
      <div>
        <Chart
          chartType="PieChart"
          loader={<Skeleton className=" rounded-full"></Skeleton>}
          data={[["Task", "Hours per Day"], ...result]}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </div>
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
