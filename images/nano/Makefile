clean:
	@rm -rf ./build

compile-linux:
	@deno compile --target=x86_64-unknown-linux-gnu \
	--allow-sys --allow-env --allow-read --allow-write=__hyper__,/tmp/hyper --allow-net \
	--unstable --no-check=remote \
	--output ./build/hyper-x86_64-unknown-linux-gnu-$(VER) mod.js

compile-apple:
	@deno compile --target=x86_64-apple-darwin \
	--allow-sys --allow-env --allow-read --allow-write=__hyper__,/tmp/hyper --allow-net \
	--unstable --no-check=remote \
	--output ./build/hyper-x86_64-apple-darwin-$(VER) mod.js

compile-arch-apple:
	@deno compile --target=aarch64-apple-darwin \
	--allow-sys --allow-env --allow-read --allow-write=__hyper__,/tmp/hyper --allow-net \
	--unstable --no-check=remote \
	--output ./build/hyper-aarch64-apple-darwin-$(VER) mod.js

compile-windows:
	@deno compile --target=x86_64-pc-windows-msvc \
	--allow-sys --allow-env --allow-read --allow-write=__hyper__,/tmp/hyper --allow-net \
	--unstable --no-check=remote \
	--output ./build/hyper-x86_64-pc-windows-msvc-$(VER) mod.js
