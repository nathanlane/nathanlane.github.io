---
title: 'Quick Note: Writing large .csv files in R with fwrite()! and beyond'
date: 2017-03-31 00:00:00 Z
categories:
- Tutorial
layout: post
type: post
author: Nathaniel
---

<h4> The problem.</h4>

R can be nasty when it comes to reading and writing "large" datasets. As practitioners, we often appeal to hacky practices, emergent libraries, alternatives methods to avoid crashing our systems during heavy jobs.

One alternative [I had the appealed to]({{ base }}/tutorial/2016/01/27/ffasthackforbigdata.html) was the __[<code>ff</code> library](https://cran.r-project.org/web/packages/ff/index.html)__ , a great library for processing large data. Importantly, <code>ff</code> had an awesome function for quickly saving multi-gig .csv files (<code>write.table.ffdf</code>). 

Recently, however, <code>write.table.ffdf</code> (and other go-to methods) seemed to constantly crash large jobs on my Linux machine. I'd come back to my computer to only to find,

<div class="media image">
<img src="{{ site.baseurl }}/assets/fatality.png" />
</div>

<h4> fwrite() to the rescure.</h4>

(Re-)enter the <code>data.table</code> package. Like <code>ff</code>, <code>data.table</code> is useful in its own right for processing big data. Though the library __had__ great methods for quickly opening large files with its <code>fread()</code> command, it lacked a comparable <code>fwrite()</code> command. Until now...

<code>data.table</code> author, __[Matt Dowle](https://github.com/mattdowle)__, is experimenting with adding (See his extensive blog post [here](http://blog.h2o.ai/2016/04/fast-csv-writing-for-r/)) an <code>fwrite()</code> functon (contributed by Otto Seiskari) to the package. Like <code>fread()</code>, <code>fwrite()</code> is also written in C and is surprisingly efficient. 

The <code>fwrite()</code> function has truly come through for me, allowing me to write terrabytes of weather data without the complications I have run into with other packages.

<h4>Installing fwrite() functionality.</h4>

As of March 30, 2017, <code>fwrite()</code> function hasn't been added to current, core CRAN release of the package. To install the development version of the <code>data.table</code> library with the <code>fwrite()</code> command, you'll have to uninstall your current standard version of the library and install the development version from the github repository:

{% highlight R %}
remove.packages("data.table")
install.packages("data.table", 
	type = "source",
    repos = "http://Rdatatable.github.io/data.table" )
{% endhighlight %}

See [the data.table wiki for more](https://github.com/Rdatatable/data.table/wiki/Installation).s

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


There wont be any documentation; don't be alarmed when nothing shows up when you type <code>?(?)fwrite</code>:

{% highlight R %}
> ?fwrite
No documentation for ‘fwrite’ in specified packages and libraries:
you could try ‘??fwrite’
{% endhighlight %}

For my current project I have to repeatedly process a hundred files, each with over 40 million lines (around 4 gigs each). Writing these data.frames to a .csv takes under a minute on a pretty lowly desktop:

<div class="media image">
<img src="{{ site.baseurl }}/assets/fwritespeed.png" />
</div>

Much faster than other methods.

Also: fairly recently, the prolific Wes McKinney and Hadley Wickham developed the <code>feather</code> package ([See: http://github.com/wesm/feather](http://github.com/wesm/feather).) to address some of the memory issues that plague folks trying to edit and save large data sets in R (See a pretty good discussion [here](https://blog.rstudio.org/2016/03/29/feather/).).
