
# EasyPass

⚡Vite + Electron & Doubleshot Template

## How to use

```bash
# install dependencies
yarn # npm install

# run in developer mode
yarn dev # npm run dev

# build
yarn build # npm run build
```

## Note for PNPM

In order to use with `pnpm`, you'll need to adjust your `.npmrc` to use any one the following approaches in order for your dependencies to be bundled correctly (ref: [#6389](https://github.com/electron-userland/electron-builder/issues/6289#issuecomment-1042620422)):
```
node-linker=hoisted
```
```
public-hoist-pattern=*
```
```
shamefully-hoist=true
```

