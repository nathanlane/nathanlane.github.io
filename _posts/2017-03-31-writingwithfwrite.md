---
layout: post
title: "Quick Note: Writing large .csv files in R with fwrite()! and beyond"
type: post
categories:
- Tutorial
author:
  "Nathaniel"
---

R can be nasty when it comes to reading and writing "large" datasets. As practitioners we often appeal to hacks, practices, and emergent libraries to avoid crashing our systems during heavy jobs.

One alternative [I had the appealed to]({{ base }}/tutorial/2016/01/27/ffasthackforbigdata.html) was the__[<code>ff</code> library](https://cran.r-project.org/web/packages/ff/index.html)__, a great library for processing large data. Importantly, <code>ff</code> had an awesome ff. for quickly saving multi-gig .csv files (<code>ff::write.table.ffdf</code>). 

Recently, however, <code>ff::write.table.ffdf</code> (and other goto methods) seemed to constantly crash large jobs on my Linux machine. I'd come back to my computer and find this gem:

<div class="media image">
<img src="{{ site.baseurl }}/assets/fatality.png" />
</div>

(Re-)enter the <code>data.table</code> package. Like ff, <code>data.table</code> is useful in its own right for processing large data sets. In particular, the library __had__ great methods for reading data into memory with its wonderful <code>fread()</code> command. For a long time, however, it lacked a comparable <code>fwrite()</code> command. Until now...

Now, <code>data.table</code> author, [Matt Dowle](https://github.com/mattdowle), has experimented with adding (See his extensive blog post here) an <code>fwrite()</code> functon (contributed by Otto Seiskari) to the package. Like <code>fread()</code>, <code>fwrite()</code> also written in C and is surprisingly efficient. 

So far, it <code>fwrite()</code>  truly come through for me and has been able to write terrabytes of weather data without the complications I have run into using other big data packages.

As of March 30, 2017, <code>fwrite()</code> function hasn't been added to current, core CRAN release of the package. 

To install the development version of the <code>data.table</code> library with the <code>fwrite()</code> command, you'll have to uninstall your old version of data.table and install the development version from the github repository:

{% highlight R %}
remove.packages("data.table")
install.packages("data.table", 
	type = "source",
    repos = "http://Rdatatable.github.io/data.table" )
{% endhighlight %}

(See [the data.table wiki for more](https://github.com/Rdatatable/data.table/wiki/Installation).)

{% highlight R %}
installing to /home/XXX/R/x86_64-pc-linux-gnu-library/3.3/data.table/libs
** R
** inst
** byte-compile and prepare package for lazy loading
** help
*** installing help indices
** building package indices
** installing vignettes
** testing if installed package can be loaded
* DONE (data.table)
{% endhighlight %}


There wont be any documentation, so don't be alarmed when nothing shows up when you type <code>?(?)fwrite</code>:

{% highlight R %}
The downloaded source packages are in
	‘/tmp/Rtmpgw0bi9/downloaded_packages’
> ?fwrite
No documentation for ‘fwrite’ in specified packages and libraries:
you could try ‘??fwrite’
> ??fwrite
{% endhighlight %}

For my current project I have to repeatedly process a hundred files, each with over 40 million lines (around 4 gigs each). Writing these data.frames to a .csv takes under a minute on a pretty lowly desktop:

<div class="media image">
<img src="{{ site.baseurl }}/assets/fatality.png" />
</div>

Much faster than other methods.

Also: fairly recently, the prolific Wes McKinney and Hadley Wickham developed the <code>feather</code> package ([http://github.com/wesm/feather.](http://github.com/wesm/feather.) to address some of the memory issues that plague folks trying to edit and save large data sets in R (See a pretty good discussion [here](https://blog.rstudio.org/2016/03/29/feather/).).
