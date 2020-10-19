<script>
  import Nav from '../../components/Nav.svelte';
</script>

<header>
  <Nav active="API" />
  <h1><u>Atlas Toolkit</u> API</h1>
  <p>The API is documented using openapi 3.0.3 and is currently available in two versions: 
    Stable version which is the version available from the main branch of the repository. And the unstable version
  which is available from the staging branch of the repository. Since the current status is under the design and build 
mode you should consider both not ready for production use.</p>
</header>
<main>
  <section>
    <a href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/hyper63/atlas/main/swagger.yml">
      <aside>Stable</aside>
    </a>
    <a href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/hyper63/atlas/staging/swagger.yml">
      <aside>Unstable</aside>
    </a>
  </section>
</main>
