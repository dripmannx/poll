import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
type Props = {};

const Poll = (props: Props) => {
  const router = useRouter();
  const slug = router.query.slug || [];
  const id = slug[0] as string;
  const poll = api.pollRouter.getPollById.useQuery(
    { id: id },
    { enabled: id ? true : false }
  );

  return <div>{JSON.stringify(poll.data)}</div>;
};

export default Poll;
