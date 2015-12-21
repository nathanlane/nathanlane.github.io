---

layout:			default
title:  		Front-matter matters, literally
type:			post
navigation: 	false

date:   		2014-05-05
excerpt: 		By now you should be already familiar with the concept of front-matter to control content and layout. Aside from basic options, <b>there are a few more</b> I'd like to introduce you to — <i>even though they're just optional</i>.
categories:		guides
gradient: 		4
image: 			header-3.jpg
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

## Advanced, optional front-matter

You already know how to *create posts and pages* and *what front-matter means*. But did you also know that front-matter is a **seriously powerful way to control contents and appearance** of each page?

Meet the advanced, optional front-matter you can add to the top of each post or page.

{% include media-image.html file="advanced-front-matter.jpg" title="Advanced front-matter" caption="This is the front-matter of the page you're currently viewing" %}

Below you'll see a *detailed description of each of these options*, what they do and how you can use them in order to control many aspects of the page easily — I'll skip `layout`, `title` and `type` though.

- **navigation:** Can be either `true` or `false` and controls wether the post or page appears in the navigation or not. This just works if `type` is either set to `post` or `page`.
- **date:** It's a good practice to set the date within each file as well even though it's not required. The order of all posts and pages added to the navigation depends on their date too.
- **excerpt:** A **quick summary** which shows up on top of each page as well as on the homepage listing.
- **categories:** Add one or more `categories` for each page or post — they're part of the excerpt and influence the way Jekyll builds the sites hierarchy.
- **gradient:** Specify a number between 1 and 5 to define the **color of the gradient** applied to the header of the post or page.
- **image:** Add an image to the `images` folder and add its file name here so it shows up on top of the page. The **perfect size would be 1200 x 700px** but everything should work just fine considering that it will be scaled accordingly anyway.
- **details:** Can be either `true` or `false` and specifies wether the header image selected for this page will show up in the homepage listing as well.
- **author:** Feel free to add the name of the posts or pages author.
- **bio:** A short description or bio can be appended too.

The remaining front-matter should be self-explanatory in my opinion and you're able to *attach various social media profile links* to the authors profile. 

Please keep in mind though that **links usually include colons and these are reserved by YAML**. That said, make sure that you wrap links (and literally anything else which might include colons) into quotes so they don't break it.