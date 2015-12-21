---

layout:			default
title:  		Adding media with captions
type:			post
navigation: 	false

date:   		2014-05-07
excerpt: 		Adding <b>images</b>, <b>videos</b> and <b>audio files</b> to a website shouldn't be difficult. That's why <i>Hashtag for Jekyll</i> includes some <b>simple short codes</b> which make it easy to add all of that — even better, you can also add captions and links to each one.
categories:		guides
gradient: 		5
image: 			header-2.jpg
details:		false

author: 		Maximilian Bartel
bio: 			I'm a freelance web designer who enjoys creating beautiful and standard compliant solutions for my clients from all around the world.
twitter: 		"http://twitter.com/indiqo"
facebook: 		"http://facebook.com"
google: 		"http://google.com"
linkedin: 		"http://linkedin.com"
pinterest: 		"http://pinterest.com"
flickr: 		"http://flickr.com"
dribbble: 		"http://dribbble.com"
rss: 			"feed://themeforest.net/feeds/users/indiqo"

---

*First things first:* You can use the following shortcodes on **every page** and in **every post** as often as you like directly in between of your written contents.

They are most likely the *easiest way to enrich your contents* with suitable media, you can add **captions**, **descriptions** and **links** to them and they also *seamlessly adapt to the screen size of your visitors* to avoid breaking the look and feel.

Below I'll just add a few images, videos and audio files for reference purposes and will try to describe how it works.

### Images

Let's begin with an **image** which has been already added to the `images` folder inside the theme directory which is mandatory for this type of media by the way.

{% include media-image.html file="shortcode-image.jpg" title="Shorcode Preview" caption="This is how each of the shortcodes look like — the ideal image width should be at least 796px by the way" link="http://themeforest.net/user/indiqo" %}

### YouTube videos

Next up, a **video on YouTube** — I really like Jack Johnson's music and listened to it pretty much all of the time while working on this theme, so why not share a video with you.

{% include media-youtube.html file="https://www.youtube.com/watch?v=PeFJlk8eOhQ" title="You And Your Heart" caption="Just add the video url and the shortcode will do everything else for you" link="http://jackjohnsonmusic.com" %}

### Vimeo videos

Of course it's also possible to do just the same with **Vimeo videos**.

{% include media-vimeo.html file="http://vimeo.com/20344943" title="Love Snowboarding" caption="All contents automatically adjust their size depending on the visitors screen resolution" link="http://protectourwinters.org" %}

### Soundcloud music

Adding **music from Soundcloud** is that easy too.

{% include media-audio.html file="https://soundcloud.com/avicii-tomorrowland-2013/avicii-live-at-tomorrowland-2013" title="Great Sound" caption="Quite convenient.. for a static site generator." link="http://www.tomorrowland.com" %}