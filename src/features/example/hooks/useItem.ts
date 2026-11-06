import { useQuery } from "@tanstack/react-query";
import { getItemByIdAction } from "../actions";

interface Props {
  id: number;
}

export const useItem = ({ id }: Props) => {
  const itemQuery = useQuery({
    queryKey: ["items", id],
    queryFn: () => getItemByIdAction(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 1000 * 60 * 5,
  });

  return { itemQuery };
};
