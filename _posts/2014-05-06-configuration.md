---

layout:			default
title:  		Configuration
type:			post
navigation: 	false

date:   		2014-05-06
excerpt: 		Wether you'd like to change the sites <b>title</b>, <b>description</b> and <b>contact email address</b> or just like to enable the <b>comment system</b> or <b>Google Analytics</b> — <i>all of it can be done in one single place</i>.
categories:		guides
gradient: 		3
image: 			header-1.jpg
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

Now that you should be familiar with **YAML and basic front-matters**, it should be easy to adjust the sites global settings.

In order to do so, please open up the `_config.yml` file in your favorite code or text editor.

Similar to front-matter of posts and pages, the area between both triple-dashes includes various options to configure the site.

{% include media-image.html file="config-example.jpg" title="Default Settings" caption="This is how the default config file looks like — not too complex though" %}

Some of them, such as `title`, `name`, `description`, `url` or `copyright` should be self-explaining, so let's have a look at the others below.

- **baseurl:** The `baseurl` can remain empty by default and is just required if you're going to **host your site in a subfolder** of your webspace such as `/blog` for example. In this case, you would have to add `/blog` as value of this option to make sure paths will be correct.
- **paginate:** Defines the amount of posts displayed per page on the homepage.
- **paginate_path:** This option defines the folder structure for paginated index pages. It's slightly more advanced and you can just **leave it as it is** — for more details, please feel free to have a look at [this page](http://jekyllrb.com/docs/pagination/) on the Jekyll website.
- **twitter:** Please feel free to add your **Twitter username** without the *@* here or leave it empty. The username will be used for [Twitter Cards](https://dev.twitter.com/cards) supported by the theme.
- **disqus:** Sign up for a free account on [Disqus](http://disqus.com) and **add your unique shortname** to this option in order to enable comments for each post.
- **analytics:** Add your [Google Analytics](https://www.google.de/analytics/) **Tracking ID** here to enable statistics and tracking of each post and page.