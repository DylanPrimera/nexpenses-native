import { exampleApi } from "@/core";
import type { Item, ItemApiResponse } from "../interfaces";

const PAGE_SIZE = 10;

export const getItemsAction = async (page: number): Promise<Item[]> => {
  const { data } = await exampleApi.get<ItemApiResponse[]>("/posts", {
    params: {
      _page: page,
      _limit: PAGE_SIZE,
    },
  });

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    userId: item.userId,
  }));
};

export const getItemByIdAction = async (id: number): Promise<Item> => {
  const { data } = await exampleApi.get<ItemApiResponse>(`/posts/${id}`);
  return {
    id: data.id,
    title: data.title,
    body: data.body,
    userId: data.userId,
  };
};
