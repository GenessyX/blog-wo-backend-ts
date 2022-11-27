import { ArticleManager } from "../article-manager";
import type { IArticle } from "../interfaces/article.interface";

const CREATE_COUNT = 20;

export const fixture = () => {
  for (let i = 0; i < CREATE_COUNT; i++) {
    const article: IArticle = {
      id: i,
      title: `Article #${i.toString()}`,
      content: `Content #${i.toString()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    ArticleManager.saveArticle(i, article);
  }
};
