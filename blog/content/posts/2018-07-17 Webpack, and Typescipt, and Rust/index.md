---
title: Webpack, and Typescipt, and Rust
author: Eric Haskins
date: 2018-07-17
tags:
 - rust
 - webpack
 - typescript
 - wasm
---

# Notes on my configuration

Hopefully I'll put together a self container repo with this configuration, but for now here's some notes on configuring Rust/Wasm build using wasm-bindgen and getting it to play well with TypeScript.

With this config, clean webpack builds should succeed without any pre-existing Rust artifacts. Dev-time tooling for typescript will work after the first wasm32 build. Until then the `.d.ts` file for the Rust module won't exist, and TypeScript will complain it can't find the module.

Next step is to make this all hot-reload, but now without HMR incremental Webpack builds and refreshing the browser works fine.

# The configuraton

- Rust
  - Install Rust and wasm32-unknown-unknown toolchain, and wasm-bindgen
    - https://rustwasm.github.io/wasm-bindgen/basic-usage.html
- Webpack
  - Configure alias with friendly name pointing to `lib.rs`
  - Remove `TsconfigPathsPlugin`. It gets confused.
  - Install `rust-native-wasm-loader`, and configure it:

```
{
  test: /\.rs$/,
  use: [
    {
      loader: 'rust-native-wasm-loader',
      options: {
        wasmBindgen: {
        typescript: true
        }
      }
    }
  ]
},
```

- Typescript
  - Add mapping from friendly name to wasm-bindgen output, `target/wasm32-unknown-unknown/debug/[filename].js`, to `compilerOptions.paths` property in `tsconfig.json`
  - Set `compilerOptions.baseUrl` to `./`. `compilerOptions.paths` requires it.
