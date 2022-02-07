test:
	@deno test --allow-env --allow-net --allow-read --allow-write --import-map import_map.json --no-check mod.js

cache:
	@deno cache --lock=mod_lock.json --import-map import_map.json --lock-write --no-check=remote mod.js