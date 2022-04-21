run:
	@deno run -A --unstable --no-check=remote mod.js

test:
	@deno lint && deno fmt --check && DENO_ENV=test deno test -A --unstable --no-check=remote

cache:
	@deno cache --unstable --no-check --lock=deps_lock.json --lock-write --reload deps.js

clean:
	@rm -rf ./build

compile-linux:
	@deno compile --target=x86_64-unknown-linux-gnu --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote --output ./build/hyper-x86_64-unknown-linux-gnu mod.js

compile-apple:
	@deno compile --target=x86_64-apple-darwin --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote --output ./build/hyper-x86_64-apple-darwin mod.js

compile-arch-apple:
	@deno compile --target=aarch64-apple-darwin --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote --output ./build/hyper-aarch64-apple-darwin mod.js

compile-windows:
	@deno compile --target=x86_64-pc-windows-msvc --allow-env --allow-read --allow-write=__hyper__ --allow-net --unstable --no-check=remote --output ./build/hyper-x86_64-pc-windows-msvc mod.js
