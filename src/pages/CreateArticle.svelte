<script lang="ts">
  import { writable } from "svelte/store";
  //   import { articles } from "../stores";
  import { ArticleManager } from "../article-manager";
  import type { IArticle } from "../interfaces/article.interface";
  export let articleId: number;

  let title = writable("");
  let content = writable("");

  function createArticle() {
    const article: IArticle = {
      id: articleId,
      title: $title,
      content: $content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    ArticleManager.saveArticle(articleId, article);
    location.hash = "#list:3:0";
  }
</script>

<a href="#list:3:0"> Back to list </a>

<div>
  <h1>Title:</h1>
  <input type="text" bind:value={$title} />
  <h3>Content:</h3>
  <input type="text" bind:value={$content} />
  <button on:click={createArticle}>Create article</button>
</div>
