<script>
  import Nav from '../../components/Nav.svelte';
</script>

<header>
  <Nav active="Guides" />
  <h1><u>Atlas Toolkit</u> Guides</h1>
  <p class="slug">Below is a guide for each tool in the Atlas toolkit, the guide, will explain the tools purpose, 
    why you would want to use it, and an example of how it can be used.
  </p>
  <a href="/getting-started"><i>Getting Started with Atlas Toolkit</i></a>
</header>
<main>
  <section>
    <a href="/guides/data">
    <aside>
      <h3>Data Guide <img style="float: right;height: 32px;" src="/arrow-right-up.svg" /></h3>
    </aside>
    </a>
    <a href="/guides/cache">
    <aside>
      <h3>Cache Guide <img style="float: right;height: 32px;" src="/arrow-right-up.svg" /></h3>
    </aside>
    </a>
    <a href="/guides/storage">
    <aside>
      <h3>Storage Guide <img style="float: right;height: 32px;" src="/arrow-right-up.svg" /></h3>
    </aside>
    </a>
  </section>
</main>
<style>
  .slug {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  aside {
    background: rgb(131,58,180);
    background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
    color: white;
  }
  
</style>