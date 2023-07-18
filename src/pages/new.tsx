import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { ControllerRenderProps, useForm, useFormState } from "react-hook-form";
import * as z from "zod";
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
type choice = {
  choicesText: string;
};
export const formSchema = z.object({
  question: z.string().min(2, {
    message: "Frage muss mindestens 2 Zeichen lang sein",
  }),
  choices: z
    .object({
      choicesText: z
        .string()
        .min(5, { message: "Frage muss mindestens 5 Zeichen lang sein" }),
    })
    .array(),

  expire: z.date().optional(),
});
export default function ProfileForm() {
  // ...
  const router = useRouter();

  const [inputs, setInputs] = useState<string[]>([""]);
  const utils = api.useContext();
  const [formStep, setFormStep] = useState(1);
  const [choices, setChoices] = useState<choice[]>([]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      choices: [],
      expire: undefined,
    },
  });
  const { mutate, data } = api.pollRouter.createPoll.useMutation({
    onSuccess: () => {
      utils.pollRouter.getAllPollsByCreatedAt.invalidate();
      router.push("/");
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    values.choices = inputs.map((choicesText) => ({ choicesText }));

    mutate(values);
  }

  return (
    <div className="container mt-5 flex  justify-center">
      <Card className="w-[90%] lg:w-[50%] ">
        <CardHeader>
          <CardTitle>Neue Umfrage erstellen</CardTitle>
          <CardDescription>
            Erstelle eine Umfrage um sie zu veröffentlichen{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="" placeholder="Titel" {...field} />
                    </FormControl>
                    <FormDescription>
                      Dies ist der Titel unter der deine Umfrage veröffentlicht
                      wird
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <>
                <FormField
                  control={form.control}
                  name="choices"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DynamicInputs inputs={inputs} setInputs={setInputs} />
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
                  name="expire"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
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
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange as any}
                            disabled={(date: Date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Wähle das Datum, an dem die Umfrage abläuft oder lasse
                        dieses Feld leer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>

              <CardFooter className=" p-0">
                <>
                  <div className="flex gap-2">
                    <Button className="" type="submit">
                      Umfrage erstellen
                    </Button>
                  </div>
                </>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
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
        <div key={index} className="flex w-full flex-row">
          {index > 0 && (
            <Button variant={"link"} onClick={() => removeInput(index)}>
              Remove
            </Button>
          )}
          <Input
            className=""
            label=""
            placeholder="Auswahl"
            value={input}
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  );
};

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Calendar } from "~/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/utils/utils";

const FormSchema = z.object({
  expire: z.date().optional(),
});

export function CalendarForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="expire"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
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
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange as any}
                    disabled={(date: Date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
