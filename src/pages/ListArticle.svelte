<script lang="ts">
  import { ArticleManager, articleList } from "../article-manager";
  import { fixture } from "../fixtures/fixtures";
  const DEFAULT_LIMIT = 3;
  const DEFAULT_OFFSET = 0;
  export let limit: number = DEFAULT_LIMIT; // = writable(10);
  export let offset: number = DEFAULT_OFFSET; // = writable(0);
  $: articles = ArticleManager.getArticles(limit, offset);
  $: lastArticle = ArticleManager.count();
  const init = localStorage.getItem("i");
  if (!init) {
    fixture();
    localStorage.setItem("i", "1");
  }
</script>

<div>
  <a href="#create:{lastArticle + 1}"> Create new article </a>
</div>

<ul>
  {#each articles as article}
    <a class="article" href="#detail:{article.id}">
      <div class="article-header">
        <h1>{article.title}</h1>
      </div>
      <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
      <p>Updated: {new Date(article.updatedAt).toLocaleString()}</p>
    </a>
  {/each}
</ul>

<div class="nav">
  {#if offset >= DEFAULT_LIMIT}
    <a
      class="prev"
      href="#list:{DEFAULT_LIMIT}:{(offset || DEFAULT_OFFSET) - DEFAULT_LIMIT}"
      >Previous Page</a
    >
  {/if}
  {#if offset + DEFAULT_LIMIT - 1 < lastArticle}
    <a
      class="next"
      href="#list:{DEFAULT_LIMIT}:{(offset || DEFAULT_OFFSET) + DEFAULT_LIMIT}"
      >Next Page</a
    >
  {/if}
</div>

<style>
  h1 {
    margin: 0;
  }
  .article-header {
    display: flex;
  }
  .nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .prev {
    position: absolute;
    left: 0;
  }
  .next {
    position: absolute;
    right: 0;
  }
</style>
