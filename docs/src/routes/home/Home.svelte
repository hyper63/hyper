<script>
  import Nav from '../../components/Nav.svelte';
</script>

<header>
  <Nav active="Home" />
  <h1>Atlas <u>Toolkit</u></h1>
  <p>A collection of tools for your <mark>micro-services.</mark></p>
  <p>Atlas is your side-kick to anti-fragile micro-services.</p>
  <p><a href="/getting-started"><i>Getting Started</i></a> <a href="/guides"><b>Guides</b></a></p>
</header>
<main>
  <hr />
  <section>
    <header>
      <h2>Atlas Tools</h2>
      <p>Atlas Toolkit gives you the tools you need to create scalable micro-services in a cloud-native environment</p>
    </header>
    <aside>
      <h3>Data</h3>
      <p>Structured document api, with the power to organize and query json documents.</p>
      <a href="/guides/data"><b>Guide</b></a>
    </aside>
    <aside>
      <h3>Cache</h3>
      <p>Key-Value api, for lighting fast access times.</p>
      <br />
      <a href="/guides/cache"><b>Guide</b></a>
    </aside>
    <aside>
      <h3>Storage</h3>
      <p>Unstructure object api, storing and retrieving files</p>
      <br />
      <a href="/guides/storage"><b>Guide</b></a>
    </aside>
  </section>
  <hr />
  <section>
    <header>
      <h2>Coming Soon</h2>
      <p>We are not stopping with the basics, atlas tools is <mark>constantly</mark> adding tools to the kit.</p>
    </header>
    <aside>
      <h3>Webhooks <sup>In Development</sup></h3>
      <p>Hook into Atlas Tool events</p>
    </aside>
    <aside>
      <h3>Search <sup>In Design</sup></h3>
      <p>Create your own search stores</p>
    </aside>
    <aside>
      <h3>Queues <sup>In Design</sup></h3>
      <p>Use the pub/sub pattern with your micro-service</p>
    </aside>
  </section>
</main>
