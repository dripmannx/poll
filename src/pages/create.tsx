import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

type Props = {};
type choice = {
  choicesText: string;
};
const CreateNewPoll = (props: Props) => {
  const utils = api.useContext();
  const mutateCreate = api.pollRouter.createPoll.useMutation({
    onSuccess: () => {
      utils.pollRouter.getAllPollsByCreatedAt.invalidate();
    },
  });
  const [state, setState] = useState("");
  const [choices, setChoices] = useState<choice[]>([]);
  const [choicesText, setChoicesText] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateCreate.mutate({
            question: state,
            public: false,
            choices: choices,
          });
        }}
      >
        <Input
          label=""
          placeholder="Umfrage"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <Input
          label=""
          placeholder="Auswahl"
          value={choicesText}
          onChange={(e) => setChoicesText(e.target.value)}
        />
        <Button
          variant={"secondary"}
          onClick={() => {
            setChoices([...choices, { choicesText: choicesText }]);
            setChoicesText("");
          }}
          className=""
          type="button"
        >
          Hinzufügen
        </Button>

        <Button className="" type="submit">
          Submit
        </Button>
      </form>
      <div className="container justify-center gap-12 px-4 py-16 ">
        <Card className="hover:border-slate-600">
          <CardHeader>
            <CardTitle>Neue Umfage erstellen</CardTitle>
            <CardDescription>
              <div>item.question</div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>item.link</div>
            <div>item.createdAt</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNewPoll;
