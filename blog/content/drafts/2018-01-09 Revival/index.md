---
title: Revival
author: Eric Haskins
date: 2018-01-09
tags:
  - Meta
---

I decided it's time to try to blog again. I'm planning to some longer form content, and I want a place to post random things I fight with.

# Goals

* Seperate area for long-lived articles
* Blog w/ rss
* SiteMap
* Support for additional code / visualization in articles
* Build visualizations as part of main webpack build
* Dynamically load additional code to keep bundle size down
* SSR text content w/placeholders for visualizations
* Adding/changing article or article code should not change hash/name of core bundle

# The Project

In addition to actually writing some new content, there are a few things I'd like to do the make this site respectable.

1. I never finished doing the graphics/design. It's needs to stop sucking.
2. Build process. Currently based on a hacked together Metalsmith process that I put together in 2015. Needs updates at the very least.
3. I want to seperate projects, long lived articles and write and forget blog posts.
4. Get rid of Disqus. Maybe replace it...

# Build Process

I figured step one was to see if two year old Metalsmith build process would still run. Honestly, I didn't expect it to, but ignoring the multitude of deprecated package it still worked.

I never really finished

# Migrating

Moving posts to folder per folder structure

```
dir | % {
>> $folder = $_.BaseName
>> mkdir $folder;
>> move $_.Name (Join-Path $folder index.md)
>> }
```
