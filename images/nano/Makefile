run:
	@deno run -A --unstable --no-check=remote mod.js

compile:
	@deno compile --allow-env --allow-read --allow-write=/tmp,. --allow-net --unstable --no-check=remote --output hyper mod.js

test:
	@deno lint && deno fmt --check && DENO_ENV=test deno test -A --unstable --no-check=remote

cache:
	@deno cache --unstable --no-check --lock=deps_lock.json --lock-write --reload deps.js