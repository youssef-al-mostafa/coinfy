import { TradeIdea } from "@/lib/types";
import { tradeIdeas } from "@/lib/data/tradeIdeas";

export const getTradeIdea = async (index: number = 0): Promise<TradeIdea> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return tradeIdeas[index];
};

export const getAllTradeIdeas = async (): Promise<TradeIdea[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return tradeIdeas;
};
