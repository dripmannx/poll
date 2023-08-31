import { GetResult } from "@prisma/client/runtime/library";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Metadata } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillPieChart } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { MdEdit } from "react-icons/md";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Spinner from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { Poll } from "~/utils/types";

dayjs.extend(relativeTime);
export const metadata: Metadata = {
  title: "Meine Umfragen",
  description: "Hier findest du alle deine Umfragen",
};

const MyPolls = () => {
  const utils = api.useContext();
  const deletePoll = api.pollRouter.deletePoll.useMutation({
    onSuccess(data, variables, context) {
      utils.pollRouter.getPollByUserId.invalidate();
      utils.pollRouter.getPollByUserIdWithCount.invalidate();
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
    error: pollError,
    isError,
  } = api.pollRouter.getPollByUserIdWithCount.useQuery();

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
  console.log(data);
  console.log(
    "user_2SkArlnQjGq3eSAqLOwp8U51ali" === "user_2SkArlnQjGq3eSAqLOwp8U51ali"
  );
  return (
    <>
      <Head>
        {" "}
        <meta property="og:title" content="Meine Umfragen" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dripmann.de/" />
        <meta
          property="og:description"
          content="Hier finden Sie alle Umfragen"
        />
        <title>Meine Umfragen</title>
      </Head>
      <div className="mt-5 lg:container">
        {isLoading && <Spinner />}
        {data?.length === 0 && <NoPolls />}{" "}
        {/* <div className=" grid grid-cols-3 gap-4">
          {data?.map((item) => (
            <Card
              key={item.id}
              onClick={() => router.push(`/${item.link}`)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="group  relative cursor-pointer hover:shadow-lg dark:hover:border-gray-500"
            >
              {" "}
              <div className="absolute right-0 top-0 -mr-4 -mt-4 hidden rounded-full p-2 shadow-lg hover:flex group-hover:flex dark:bg-white">
                <FaExternalLinkAlt color="black" />
              </div>
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
        </div> */}
        {data?.length !== 0 && !isLoading && (
          <div className="mt-5 w-full rounded-xl ">
            <Table>
              <TableCaption>Alle Deine Umfragen an einem Ort</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Umfragen</TableHead>
                  <TableHead className="text-center">Teilnehmer</TableHead>

                  <TableHead className="text-center">Deadline</TableHead>
                  <TableHead className="text-right">Menü</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((poll) => (
                  <TableRow
                    className="cursor-pointer"
                    key={poll.pollInfo.id}
                    onClick={() => router.push(`/${poll.pollInfo.link}`)}
                  >
                    <TableCell className="w-[50%] font-medium">
                      <div className="flex flex-row items-center gap-2">
                        {" "}
                        <AiFillPieChart size={"2em"} />
                        <div className="flex flex-col">
                          <span>{poll.pollInfo.question}</span>

                          <span className="text-gray-400">
                            {poll.pollInfo.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" text-center">
                      {poll.uniqueVotersCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {poll.pollInfo.willExpire
                        ? poll.pollInfo.expiredAt.toLocaleDateString()
                        : "-"}{" "}
                    </TableCell>
                    <TableCell className=" flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                          <GoKebabHorizontal size={"2em"} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePoll.mutate({ pollId: poll.pollInfo.id });
                            }}
                            className="flex cursor-pointer gap-2"
                          >
                            <BsFillTrashFill color="red" size={"1.5em"} />
                            Löschen
                          </DropdownMenuItem>
                          {/*  <DropdownMenuItem className="flex cursor-pointer gap-2">
                          <MdEdit size={"1.5em"} />
                          Bearbeiten
                        </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
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
        <Link href={"/create"}>
          <Button>Umfrage erstellen</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
