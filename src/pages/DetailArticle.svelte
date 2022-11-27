<script lang="ts">
  import { ArticleManager } from "../article-manager";
  export let articleId: number;
  $: article = ArticleManager.getArticle(articleId);
</script>

<a href="#list:3:0"> Back to list </a>

{#if !article}
  <h1>404 Not Found</h1>
{:else}
  <div class="article" id="detail-{articleId}">
    <div class="article-header">
      <h1>{article.title}</h1>
    </div>
    <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
    <p>Updated: {new Date(article.updatedAt).toLocaleString()}</p>
    <p>
      {article.content}
    </p>
    <div class="article-footer">
      <a href="#edit:{articleId}">Edit this article</a>
      <a href="#detail:{articleId + 1}">Next</a>
    </div>
  </div>
{/if}

<style>
  .article-header {
    display: flex;
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
