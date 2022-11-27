<script lang="ts">
  import { writable } from "svelte/store";
  import ListArticle from "../pages/ListArticle.svelte";
  import DetailArticle from "../pages/DetailArticle.svelte";
  import EditArticle from "../pages/EditArticle.svelte";
  import type { Router } from "../interfaces/router.interface";
  import { onMount } from "svelte";
  import CreateArticle from "../pages/CreateArticle.svelte";

  const router: Router = {
    detail: {
      prefix: "#detail:",
      params: {
        id: Number,
      },
    },
    list: {
      prefix: "#list:",
      params: {
        limit: Number,
        offset: Number,
      },
    },
    create: {
      prefix: "#create:",
      params: {
        id: Number,
      },
    },
    edit: {
      prefix: "#edit:",
      params: {
        id: Number,
      },
    },
  };

  let page = writable("list");
  let params: Record<string, any> = {};

  function updateRoute() {
    const hash = window.location.hash;

    for (const [name, route] of Object.entries(router)) {
      if (hash.startsWith(route.prefix)) {
        page.set(name);
        const _params: Record<string, any> = {};
        if (route.params) {
          const routeParams = hash.replace(route.prefix, "").split(":");
          Object.entries(route.params).map(([name, typ], i) => {
            switch (typ) {
              case String:
                _params[name] = routeParams[i];
              case Number:
                _params[name] = parseInt(routeParams[i]);
            }
          });
        }
        params = _params;
        return;
      }
    }
  }
  window.addEventListener("hashchange", updateRoute);
  onMount(() => updateRoute());
</script>

{#if $page == "list"}
  <ListArticle limit={params.limit} offset={params.offset} />
{:else if $page == "detail"}
  <DetailArticle articleId={params.id} />
{:else if $page == "create"}
  <CreateArticle articleId={params.id} />
{:else if $page == "edit"}
  <EditArticle articleId={params.id} />
{/if}
<!-- {#if $route.startsWith(DETAIL_ROUTE)}{/if} -->
