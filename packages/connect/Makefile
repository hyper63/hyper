clean:
	@rm -rf dist to-node

# yarn build will run microbundle to bundle the transpiled node code into ESM, CJS, and UMD using microbundle
# However, the TS types are not interpreted correctly by microbundle, so we have
# to copy the types from the output of deno2node into the microbundle output folder in order to get types working
# a total hack to get the types working
to-node:
	@deno run --no-check --allow-read --allow-write \
  		https://deno.land/x/deno2node@v1.7.2/src/cli.ts ./tsconfig.to-node.jsonc && \
	yarn build && \
	echo "copying types..." && find ./to-node -mindepth 1 -depth -name '*.d.ts' -exec cp --parents \{\} ./dist \; && \
	mv ./dist/to-node/* ./dist && rm -rf ./dist/to-node
	
test-integration: clean to-node
	@cd ./node && yarn && yarn test
