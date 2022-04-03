.PHONE: setup test

setup:
	yarn install &&	yarn build && npm link

test:
	yarn test

test-watch: 
	yarn test:watch