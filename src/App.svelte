<script lang="ts">
  import { writable } from "svelte/store";
  import Router from "./router/Router.svelte";
</script>

<main class="container">
  <Router />
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1000px;
    margin: auto;
  }
</style>
