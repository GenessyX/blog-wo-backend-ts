export interface IArticle {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type IUpdateArticle = Pick<IArticle, "title" | "content" | "updatedAt">;
