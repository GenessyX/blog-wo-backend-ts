import { writable } from "svelte/store";
import type { IArticle, IUpdateArticle } from "./interfaces/article.interface";
import * as BSON from "bson";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8");
const ARTICLE_PREFIX = "a";
const ARTICLE_LIST_KEY = "b";

export let articleList = writable([]);

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
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
    const u8_2 = new Uint8Array(
      atob(article)
        .split("")
        .map(function (c) {
          return c.charCodeAt(0);
        })
    );
    //@ts-ignore
    return BSON.deserialize(u8_2);
  }

  static updateArticle(id: number, updateArticle: IUpdateArticle) {
    const article = this.getArticle(id);
    const updated = { ...article, ...updateArticle };
    localStorage.setItem(this.getId(id), JSON.stringify(updated));
  }

  static saveArticle(id: number, article: IArticle) {
    const serialized = BSON.serialize(article);
    const b64encoded = btoa(String.fromCharCode.apply(null, serialized));
    localStorage.setItem(this.getId(id), b64encoded);
    // localStorage.setItem(this.getId(id), JSON.stringify(article));
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
