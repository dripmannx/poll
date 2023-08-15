import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { api } from "~/utils/api";

import { Check, MinusIcon } from "lucide-react";
import Head from "next/head";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Spinner, { LoadingSpinner } from "~/components/ui/spinner";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/utils/utils";

export const formSchema = z.object({
  question: z.string().min(2, {
    message: "Frage muss mindestens 2 Zeichen lang sein",
  }),
  discription: z.string().optional(),
  isMultipleChoice: z.boolean().default(true),
  choices: z
    .object({
      choicesText: z.string(),
    })
    .array()
    .min(2, { message: "Mindestens 2 Antwort Optionen" }),
  expire: z.date().optional(),
});
export default function CreatePoll() {
  // ...

  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [willExpireState, setWillExpireState] = useState(false);
  const [hasDiscription, setHasDiscription] = useState(false);
  const [inputs, setInputs] = useState<string[]>([""]);
  const utils = api.useContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      choices: [{ choicesText: "" }],
      expire: undefined,
      discription: "",
      isMultipleChoice: false,
    },
  });
  const { mutate, data, isLoading } = api.pollRouter.createPoll.useMutation({
    onSuccess: async (result) => {
      toast({
        title: "Umfrage erfolgreich erstellet",
        description: "Frage: " + result.question,
      });
      setTimeout(() => {
        setIsSuccess(true);
      }, 3000);
      return router.push(`/${result.link}`);
    },
  });
  useEffect(() => {
    form.setValue(
      "choices",
      inputs.map((choicesText) => ({ choicesText }))
    );
    //Push to Link if poll is Created
  }, [inputs, data]);
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //console.log(values);
    mutate(values);
  }

  return (
    <>
      <Head>
        <title>Neue Umfrage erstellen</title>
      </Head>
      <div className="container mt-5 flex  justify-center">
        <Card className="w-[99%]  ">
          <CardHeader>
            <CardTitle>Neue Umfrage erstellen</CardTitle>
            <CardDescription>
              Erstelle eine Umfrage um sie zu veröffentlichen{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titel der Umfrage</FormLabel>
                        <FormControl>
                          <Input label="" placeholder="Titel" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dies ist der Titel unter der deine Umfrage
                          veröffentlicht wird
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {hasDiscription && (
                    <FormField
                      control={form.control}
                      name="discription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beschreibung</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Beschreibung Hinzufügen"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Schreibe eine ausführliche Beschreibung über deine
                            Umfrage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button
                    onClick={() => setHasDiscription((state) => !state)}
                    type="button"
                    variant={"ghost"}
                    className="flex gap-2"
                  >
                    {!hasDiscription ? <PlusIcon /> : <MinusIcon />}

                    {!hasDiscription
                      ? "Beschreibung hinzufügen"
                      : "Beschreibung ausblenden"}
                  </Button>
                  <>
                    <FormField
                      control={form.control}
                      name="choices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antwort-Optionen</FormLabel>
                          <FormControl>
                            <DynamicInputs
                              inputs={inputs}
                              setInputs={setInputs}
                            />
                          </FormControl>
                          <FormDescription>
                            Erstelle die Fragen die die Umfrage enthalten soll
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isMultipleChoice"
                      render={({ field }) => (
                        <FormItem className=" flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange as any}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Mehrfachantworten erlauben?</FormLabel>
                            <FormDescription>
                              Benutzer können für mehrere Antworten abstimmen{" "}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={willExpireState}
                        id="airplane-mode"
                        onCheckedChange={() =>
                          setWillExpireState((state) => !state)
                        }
                      />
                      <Label htmlFor="airplane-mode">
                        Ablaufdatum festlegen{" "}
                      </Label>
                    </div>
                    {willExpireState && (
                      <FormField
                        control={form.control}
                        name="expire"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ablaufdatum</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Wähle ein Ablaufdatum </span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date: Date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Wähle das Datum, an dem die Umfrage abläuft oder
                              lasse dieses Feld leer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>

                  <CardFooter className=" p-0">
                    <>
                      <div className="flex gap-2">
                        <Button
                          disabled={isLoading || isSuccess}
                          className="flex gap-2"
                          type="submit"
                        >
                          {isLoading && <LoadingSpinner />}
                          {isSuccess && <Check color="black" />}
                          Umfrage erstellen
                        </Button>
                      </div>
                    </>
                  </CardFooter>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
interface Props {
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  inputs: string[];
}
export const DynamicInputs = ({
  setInputs,
  inputs,

  ...props
}: Props) => {
  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index} className="relative mb-4">
          <div className="relative">
            <Input
              label=""
              type="text"
              placeholder={`Option ${index + 1}`}
              value={input}
              onChange={(event) => handleInputChange(index, event)}
              className="w-full rounded-md border  py-2  pr-2"
            />
            {index > 0 && (
              <button
                type="button"
                className="absolute right-0 top-0 h-full p-2 text-gray-400 hover:text-gray-600"
                onClick={() => removeInput(index)}
              >
                <Cross2Icon color="#fff" />
              </button>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        className="flex gap-2"
        variant={"outline"}
        onClick={addInput}
      >
        <PlusIcon />
        Add Input
      </Button>
    </div>
  );
};
