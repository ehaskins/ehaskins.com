---
title: ListenCat - The Minimally Viable Product
author: Eric Haskins
date: 2015-03-06
draft: false
---
### What's unique about ListenCat? ###
The main differentiator between ListenCat and existing podcast clients is the experience when using multiple devices. That experience is dependent on a service which can store information between devices, and intelligently manage the content available on all of the user's devices. 

### What does ListenCat need to do? ###
There are several core things a ListenCat user will need to be able to do.

 - Subscribe to feeds
 - View episodes from
	 - All feeds
	 - A subset of feeds
	 - A single feed
 - Queue episodes for future listening
 - Manage queue 
	 - Reorder episodes
	 - Remove episodes
 - Select & play episodes individually, or from the queue
 - Resume episodes where last left off
	 - Position should be syncronized between all devices

All of these capabilities will need to be available on all of a user's devices. Eventually ListenCat will need to be available on a variety of devices and platforms. I currently want to support (roughly in order of importance).

 - Modern Browsers
 - Windows Universal App
	 - Windows Phone
	 - Windows 8/10
	 - XBox One - obviously not until Windows 10 Universal apps will run here
 - Android
 - IOS

### What's MUST be done for the minimally viable product? ###
I obviously can't implement all of these clients at once, and before any can be written the back-end services need to be functional.

The first version of ListenCat:
 - Backend
	 - Download, parse and cache feeds
	 - Download and cache episode files
	 - Store played to position
 - Frontend
	 - View subscribed feeds
	 - View episodes in a feed
	 - Play an episode from a feed


### The next post ###
The next post will be looking at the technology and platform decisions I've made so far.
