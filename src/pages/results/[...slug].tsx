import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { BarLoader, CircleLoader } from "react-spinners";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";

dayjs.extend(relativeTime);

const PollResults = () => {
  const router = useRouter();
  const slug = router.query.slug || [];
  const id = slug[0] as string;

  const { data } = api.pollRouter.getVotesByPollId.useQuery(
    { pollId: id },
    { enabled: id ? true : false, retry: false }
  );
  if (data) {
  }

  return (
    <>
      <div className="container mt-5">
        {data?.map((vote) => (
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
