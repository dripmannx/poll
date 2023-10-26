import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export default function useClerkQuery(url: string) {
  const { getToken } = useAuth();

  return useQuery([url], async () => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    if (!res.ok) {
      throw new Error("Network response error");
    }

    return res.json();
  });
}
