---
title: ListenCat - Goals
date: 2015-03-04 21:17:00-6
author: Eric Haskins
---

Today I'm going to look at some of the technical and architecture decisions I've made about ListenCat.

Let's take a look at the list of issues I have with existing podcast apps (specifically the Microsoft Podcast app on Windows Phone)

> 1. It's buggy.
> 2. Slow
> 3. Can't search feeds
> 4. All data is local to phone
> 5. It gets confused by podcasts that only leave a handful of episodes in the RSS feed

I figure it's better to work off of goals instead of saying don't have problem X, so here's the list of goals derived loosely from those issues.

1. Great at one thing
	- ListenCat is for one thing only. Managing and listening to audio podcasts.
2. Cloudy
	- All episodes should be cached in the cloud lands, including played/unplayed and current position in the episode.
3. Seamless
	- Whatever device I hit play on should resume where I left off on my other device.
	- I should never have to select the next thing to play. Something should always be queued.
	- The next few episodes in my queue should be available instantly and without streaming on every device I use.

###What's next###
My next post will be looking at the feature set of a minimally viable product, probably followed by one on technical decisions and architecture.
