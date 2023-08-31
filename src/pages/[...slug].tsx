import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPoll } from "react-icons/bi";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import NotFound from "~/components/ui/notFound";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Spinner from "~/components/ui/spinner";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import RadioGroupMultipleChoice from "../components/ui/radioGroupMultipleChoice";

type EnumOption = {
  id: string;
  choiceText: string;
};

const FormSchema = z.object({
  choicesIds: z
    .string()
    .array()
    .min(1, { message: "Mindestens eine Option auswählen" }),
});

export const Poll = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectionChange = (newSelectedOptions: string[]) => {
    setSelectedOptions(newSelectedOptions);
  };
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
    onSuccess: async (result) => {
      toast({
        title: "Du hast erfolgreich abgestimmt",
      });
      router.push(`/results/${result.id}`);
    },
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (data) mutate({ choicesIds: selectedOptions, pollId: data?.id });
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

    form.setValue("choicesIds", selectedOptions);
    //Push to Link if poll is Created
  }, [data, selectedOptions]);

  if (isError) {
    return <NotFound />;
  }
  console.log(data);
  return (
    <>
      <Head>
        <title>{data?.question}</title>
      </Head>
      <div className="mt-5 lg:container ">
        <Card className={`text-2xl`}>
          <CardHeader>
            <CardTitle>{data?.question}</CardTitle>
            <CardDescription>{data?.discription}</CardDescription>
          </CardHeader>
          <CardContent>
            {getPollLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {new Date() > data?.expiredAt && data.willExpire && (
                  <div className="my-5">
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Achtung</AlertTitle>
                      <AlertDescription>
                        {"Diese Umfrage ist abgelaufen"}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="choicesIds"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Wähle eine Antwort aus</FormLabel>
                          <FormControl>
                            <RadioGroupMultipleChoice
                              isMultipleChoice={
                                data.isMultipleChoice ? true : false
                              }
                              options={enumOptions}
                              selectedOptions={selectedOptions}
                              onChange={handleSelectionChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={new Date() > data.expiredAt && data.willExpire}
                      type="submit"
                    >
                      Abstimmen
                    </Button>

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
              </>
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
