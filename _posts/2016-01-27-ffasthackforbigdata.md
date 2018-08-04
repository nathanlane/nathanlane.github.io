---
title: 'Quick Note: Using ''ff'' to quickly save giant data sets in R'
date: 2016-01-27 00:00:00 Z
categories:
- Tutorial
layout: post
type: post
author: Nathaniel
---

<div class="media image">
<img src="{{ site.baseurl }}/assets/motorcycle1970s.jpg" />
<center><small>Using a really powerful library to do something simple.</small></center>
</div>

For a current project, I am having to repeatedly manipulate and save a hundred datasets, each with about 4 million observations. While R tools like <code>fread()</code>, part of __[the <code>data.table</code> library](https://cran.r-project.org/web/packages/data.table/index.html)__, make it trivial to load massive data sets into memory, *writing* these data sets--and doing so repeatedly--is another story..

When trying to save big data sets, many of folks first recommend the <code>write.table()</code> function, which gives some people performance gains over the default <code>write.csv()</code> method. For my project, <code>write.table()</code> wasn't cutting it and, instead, often crashed my system.  

Enter the __[<code>ff</code> library](https://cran.r-project.org/web/packages/ff/index.html)__, an incredibly handy tool for working with big data. In fact, ff nimbly deals with some of R's serious memory issues (__[see a more technical guide here.](http://ff.r-forge.r-project.org/bit&ff2.1-2_WU_Vienna2010.pdf)__). Instead of doing anything fancy with ff, however, I realized one could harness the library to simply save problematic data sets. The performance gains were striking.

#### A simple alternative to write.table():

Below I take a data.table object I was manipulating (perhaps in a loop), convert it into an "ff dataframe" (ffdf), which I can then save using <code>ff</code>'s speedy .csv file writing function.


{% highlight R %}
library(magrittr) # For use of piping %>%.
library(data.table) # I use data.table to manipulate large datasets.
library(ff) # And the key package we'll use to save.

  # (Let's say I perform a bunch of data.table manipulations here)

  # Start with the data.table object,
  mygiant_datatable %>%

    # ... transform it into an ff dataframe,
    as.ffdf( . ) %>%

    # Write the ffdf object using ff's csv writing function.
    write.csv.ffdf( . , file = "/my/file/path/myfile.csv")
{% endhighlight %}


Note: the type of data table (mygiant_datatable) I was working with was quite simple, composed of only a few numeric columns. Thus, coercing the data into an ffdf object was no problemo.

Of course, in the cheap workaround above, the <code>as.ffdf()</code> adds a costly step (time-wise). However, it was well worth the benefit of utilizing the <code>write.csv.ffdf()</code> function ... and worth not crashing *ad nauseum*.
