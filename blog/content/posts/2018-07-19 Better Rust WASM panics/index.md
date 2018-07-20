---
title: Better Rust WASM Panics
date: 2018-07-19
author: Eric Haskins
tags:
  - Rust
  - WASM
  - Debugging
---

Out of the box panics from Rust WASM are pretty much useless. Install [console_error_panic_hook](https://github.com/rustwasm/console_error_panic_hook) to get panics written to `console.error`. It's README is pretty self explanitory.
