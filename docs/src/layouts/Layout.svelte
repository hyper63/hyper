<script>
  export let templateHtml, settings;
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
</svelte:head>
<div class="container">
  {@html templateHtml}
</div>
