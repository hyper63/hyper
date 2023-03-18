clean:
	@rm -rf dist to-node

to-node:
	@deno run --no-check --allow-read --allow-write \
  		https://deno.land/x/deno2node@v1.7.2/src/cli.ts ./tsconfig.to-node.jsonc && \
	yarn build && \
	echo "copying types..." && find ./to-node -mindepth 1 -depth -name '*.d.ts' -exec cp --parents \{\} ./dist \; && \
	mv ./dist/to-node/* ./dist && rm -rf ./dist/to-node
	
test-integration: clean to-node
	@cd ./node && yarn && yarn test
