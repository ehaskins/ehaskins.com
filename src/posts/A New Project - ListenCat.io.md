---
title: A New Project - ListenCat.io
date: 2015-02-12
---
### What is ListenCat.io? ###
TL;DR version, it's a podcast client for Windows 8, Windows Phone 8.1 and web. I'm starting to build it. It'll be awesome.

### Why do we need another podcast client? ###
We probably don't, but I can't find anything I'm happy with. 

A quick look at the Windows store, and there doesn't appear to be a single podcast client with more than a 2 star rating. Windows Phone isn't much better. There's the "Podcasts" app by Microsoft, but not much else. 

I've been using the Microsoft Podcasts app for a while and I have a few issues with it.

1. It's buggy.
	- Episodes don't get marked as played reliably
	- It decided to stop updating Hanselminutes
2. Slow
	- Load time is slow since it appears to try to refresh all feeds on load
	- While it's loading feeds the UI is pretty much useless
		- It jumps around, and shows some partially rendered stuff
3. Can't search feeds
	- My most important podcast is .Net Rocks, which just hit 1100 episodes, but the Podcasts app doesn't have any kind of search
		- This probably doesn't help the load times, but that's another issue
4. All data is local to phone
	- I want to be able to start listening to a podcast on my PC at work, and when I get in the car it should resume where I left off
	- Similarly marked as played should be synced between devices
5. It gets confused by podcasts that only leave a handful of episodes in the RSS feed
	- A good app would be able to cache and remember old entries, ideally while having logic to detect and handle updated entries gracefully

### What's been done?###
Well, the domain has been purchased. Beyond that, not much. I've written this post, and thought about the feature set and issues I'd like to resolve.

### What's the plan? ###
I'll be writing one post per week here while I'm working on ListenCat. The next couple posts I've been thinking about are:

- What's required for a minimally viable product
- Technical decisions/architecture overview