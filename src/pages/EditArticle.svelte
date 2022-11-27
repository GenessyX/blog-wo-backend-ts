<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { ArticleManager } from "../article-manager";
  import type { IArticle } from "../interfaces/article.interface";
  export let articleId: number;

  $: article = ArticleManager.getArticle(articleId);

  let title = writable("");
  let content = writable("");

  function updateArticle() {
    const article: Pick<IArticle, "title" | "content" | "updatedAt"> = {
      title: $title,
      content: $content,
      updatedAt: Date.now(),
    };
    ArticleManager.updateArticle(articleId, article);
    location.hash = "#list:3:0";
  }
  onMount(() => {
    title.set(article.title);
    content.set(article.content);
  });
</script>

<a href="#list:3:0"> Back to list </a>

{#if !article}
  <h1>404 Not Found</h1>
{:else}
  <div>
    <h1>Title:</h1>
    <input type="text" bind:value={$title} />
    <h3>Content:</h3>
    <input type="text" bind:value={$content} />
    <button on:click={updateArticle}>Update article</button>
  </div>
{/if}
<!-- <div>
    {#each Object.entries(articles) as [id, article]}
      <p>
        {id}: {JSON.stringify(article)}
      </p>
    {/each}
  </div> -->
