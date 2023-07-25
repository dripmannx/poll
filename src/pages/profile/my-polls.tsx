import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BarLoader } from "react-spinners";
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
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";
type Props = {};
dayjs.extend(relativeTime);

// In component:

const MyPolls = (props: Props) => {
  const { theme } = useTheme();
  const spinnerColor = theme === "light" ? "#09090b" : "#fff";
  const utils = api.useContext();
  const deletePoll = api.pollRouter.deletePoll.useMutation({
    onSuccess(data, variables, context) {
      utils.pollRouter.getPollByUserId.invalidate();
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
      {isLoading && (
        <div className="flex justify-center ">
          <BarLoader color={spinnerColor} />
        </div>
      )}
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
              <DeleteDialog
                action={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  e.stopPropagation();
                  deletePoll.mutate({ pollId: item.id });
                }}
              />
            </CardContent>
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
