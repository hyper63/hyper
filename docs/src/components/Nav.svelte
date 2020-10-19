<script>
  export let active = 'Guides';
  function isActive(display, route) {
    if (active === display) {
      return display;
    } else {
      return `<a href="${route}">${display}</a>`;
    }
  }
</script>

<style>
  img {
    height: 100px;
    width: 100px;
  }
</style>

<nav>
  <a href="/"> <img src="/atlas-logo.svg" style="border-radius: 100%;" alt="logo" /> </a>
  <ul>
    <li>
      {@html isActive('Home', '/')}
    </li>
    <li>
      {@html isActive('Why Atlas?', '/why')}
    </li>
    <li>
      {@html isActive('Guides', '/guides')}
    </li>
    <li>
      {@html isActive('API', '/api')}
    </li>
    <li><a href="https://hyper63.com">hyper63</a></li>
  </ul>
</nav>
