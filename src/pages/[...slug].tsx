import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPoll } from "react-icons/bi";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
type Props = { id: string };
type EnumOption = {
  id: string;
  choiceText: string;
};

const FormSchema = z.object({
  id: z.string(),
});

const Poll = (props: Props) => {
  const [choiceId, setChoiceId] = useState("");
  const [enumOptions, setEnumOptions] = useState<EnumOption[]>([]);
  const router = useRouter();

  const slug = router.query.slug || [];
  const id = slug[0] as string;
  const {
    data,
    isLoading: getPollLoading,
    isError,
    error: pollError,
  } = api.pollRouter.getPollById.useQuery(
    { id: id },
    { enabled: id ? true : false, retry: false }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    mutate,
    data: response,
    isError: mutateIsError,
    error: mutateError,
  } = api.pollRouter.createVote.useMutation({
    onSuccess: async () => {
      toast({
        title: "Du hast erfolgreich abgestimmt",
      });
    },
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (data) mutate({ id: values.id, pollId: data?.id });
  }

  useEffect(() => {
    if (data) {
      // Extract only the id and name properties from the fetched data
      const extractedOptions = data.choices.map((option) => ({
        id: option.id.toString(),
        choiceText: option.choiceText,
      }));
      setEnumOptions(extractedOptions);
    }
    // Fetch the enum options when the component mounts
  }, [data]);

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
    <>
      <Head>
        <title>Erstellen und Teilen Sie Umfragen</title>
      </Head>
      <div className="container mt-5 ">
        <Card
          className={`text-2xl ${
            pollError || mutateError ? "border-red-500" : null
          }`}
        >
          <CardHeader>
            <CardTitle>{data?.question}</CardTitle>
            <CardDescription>{data?.discription}</CardDescription>
          </CardHeader>
          <CardContent>
            {getPollLoading ? (
              <div className="flex justify-center">
                <BarLoader />
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Wähle eine Antwort aus</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {enumOptions.map((option) => (
                              <FormItem
                                key={option.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={option.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.choiceText}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Abstimmen</Button>
                  <Link href={`/results/${data.link}`}>
                    {" "}
                    <Button
                      className=" gap-2"
                      variant={"outline"}
                      type="submit"
                    >
                      <BiPoll />
                      Ergebnisse
                    </Button>
                  </Link>
                </form>
              </Form>
            )}
            {mutateIsError && (
              <div className="my-5">
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Fehler</AlertTitle>
                  <AlertDescription>{mutateError.message}</AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Poll;
