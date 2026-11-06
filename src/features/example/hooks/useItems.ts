import { useInfiniteQuery } from "@tanstack/react-query";
import { getItemsAction } from "../actions";

export const useItems = () => {
  const itemsQuery = useInfiniteQuery({
    queryKey: ["items", "infinite"],
    queryFn: ({ pageParam }) => getItemsAction(pageParam),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });

  return {
    itemsQuery,
    loadNextPage: itemsQuery.fetchNextPage,
  };
};
