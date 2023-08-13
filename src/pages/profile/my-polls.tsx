import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiPoll } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Spinner from "~/components/ui/spinner";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";

dayjs.extend(relativeTime);

const MyPolls = () => {
  const utils = api.useContext();
  const deletePoll = api.pollRouter.deletePoll.useMutation({
    onSuccess(data, variables, context) {
      utils.pollRouter.getPollByUserId.invalidate();
      toast({
        title: "Umfrage gelöscht",
        description: "Die Umfrage wurde erfolgreich gelöscht",
      });
    },
  });
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
        <Alert variant="default">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{pollError?.message}</AlertDescription>
        </Alert>
      </div>
    );
  }
  useEffect(() => {
    toast({
      title: deletePoll.error?.message,
    });
  }, [deletePoll.isError]);

  return (
    <div className="container mt-5">
      {isLoading && <Spinner />}
      {data?.length === 0 && <NoPolls />}{" "}
      <div className=" grid grid-cols-3 gap-4">
        {data?.map((item) => (
          <Card
            key={item.id}
            onClick={() => router.push(`/${item.link}`)}
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
            <CardFooter className="flex gap-2">
              {" "}
              <DeleteDialog
                action={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  e.stopPropagation();
                  deletePoll.mutate({ pollId: item.id });
                }}
              />
              <Link
                href={`/results/${item.link}`}
                onClick={(e) => e.stopPropagation()}
              >
                {" "}
                <Button className=" gap-2" variant={"outline"} type="submit">
                  <BiPoll />
                  Ergebnisse
                </Button>
              </Link>
            </CardFooter>
          </Card>
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
interface IDeleteDialog {
  action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const DeleteDialog = ({ action }: IDeleteDialog) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant="destructive"
        >
          Löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Umfrage wirklich löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Dieser Schritt kann nicht mehr rückgängig gemacht werden
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" onClick={(e) => e.stopPropagation()}>
            Abbrechen
          </AlertDialogCancel>
          <AlertDialogAction onClick={action} type="button">
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const NoPolls = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Du hast keine Umfrage</CardTitle>
        <CardDescription>
          Erstelle jetzt eine Umfrage und teile sie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={"/new"}>
          <Button>Umfrage erstellen</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
