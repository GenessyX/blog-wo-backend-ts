import { writable } from "svelte/store";
import type { IArticle, IUpdateArticle } from "./interfaces/article.interface";
import * as BSON from "bson";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8");
const ARTICLE_PREFIX = "a";
const ARTICLE_LIST_KEY = "b";

export let articleList = writable([]);

function encodeB64(input: Uint8Array) {
  const b64encoded = btoa(String.fromCharCode.apply(null, input));
  return b64encoded;
}

function decodeB64(input: string) {
  const u8_2 = new Uint8Array(
    atob(input)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  return u8_2;
}

export class ArticleManager {
  private static getId(id: number) {
    return ARTICLE_PREFIX + utf8Decoder.decode(new Uint8Array([id]));
  }

  static getList() {
    const packed = localStorage.getItem(ARTICLE_LIST_KEY);
    if (!packed) return [];
    const idList: number[] = [];
    for (let i = 0; i < packed.length; i++) {
      idList.push(utf8Encoder.encode(packed[i])[0]);
    }
    return idList;
  }

  static packList(l: number[]) {
    const bin = new Uint8Array(l);
    return utf8Decoder.decode(bin);
  }

  static getArticle(id: number): IArticle {
    const article = localStorage.getItem(this.getId(id));
    if (!article) return null;
    const u8_2 = decodeB64(article);
    //@ts-ignore
    return BSON.deserialize(u8_2);
  }

  static updateArticle(id: number, updateArticle: IUpdateArticle) {
    const article = this.getArticle(id);
    const updated = { ...article, ...updateArticle };
    const serialized = BSON.serialize(updated);
    const encoded = encodeB64(serialized);
    localStorage.setItem(this.getId(id), encoded);
  }

  static saveArticle(id: number, article: IArticle) {
    const serialized = BSON.serialize(article);
    const encoded = encodeB64(serialized);
    localStorage.setItem(this.getId(id), encoded);
    const _articleList = this.getList();
    articleList.set([..._articleList, id]);
  }

  static getArticles(limit = 3, offset = 0): IArticle[] {
    const articles: IArticle[] = [];
    const idList = localStorage.getItem(ARTICLE_LIST_KEY);
    for (let i = offset; i < limit + offset; i++) {
      const id = utf8Encoder.encode(idList[i])[0];
      if (id === undefined) return articles;
      const article = this.getArticle(id);
      if (!article) continue;
      articles.push(article);
    }
    return articles;
  }

  static count() {
    const idList = localStorage.getItem(ARTICLE_LIST_KEY);
    return utf8Encoder.encode(idList.slice(-1))[0];
  }
}

articleList.set(ArticleManager.getList());
articleList.subscribe((val) => {
  localStorage.setItem(ARTICLE_LIST_KEY, ArticleManager.packList(val));
});
