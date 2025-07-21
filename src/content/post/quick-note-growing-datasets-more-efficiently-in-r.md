---
title: 'Tutorial: Growing Datasets in R'
description: >-
  ![From the Field Museum collection]({{ site.baseurl
  }}/assets/pushingworkersfieldmuseum.jpg)


  Figure: [From the Field Museum archives, 1920, Photographer Herber
publishDate: '2015-06-26'
tags:
  - r
  - programming
  - tutorial
draft: true
---

![From the Field Museum collection](/images/blog/assets/pushingworkers_fieldmuseum.jpg)

Figure: <a href="http://fieldmuseumphotoarchives.tumblr.com/">From the Field Museum archives, 1920, Photographer Herbert P. Burtch, Oriental Institute. "Men moving Totem Pole outside Field Museum by train."</a>

<code>Note: This was originally some notes to RAs but I figured it may be useful for other people out there.</code>

I've had some discussion with econ folks and RAs who are working with giant datasets in R for the first time. In particular, those having to *"harvest"* or *"grow" *unweildy datasets. R is notoriously slow when it comes to expanding datasets, such as when you want to increntally append rows to a file with results from a scraping API, or combine a giant stack of raw text files from another text mining project.

The usual "good" method for concatination uses a <code>do.call</code> function with the rbind function. This method essentially takes a list of stuff and passes them as arguments all at once to <code>rbind</code>. In other words, you can take a list of *data.frame* names and bind the rows together in one motion: <code>do.call("rbind", &lt;&lt;&lt;A list of data.frame names&gt;&gt;&gt;)</code>.

### A Usual Approach

A common task I encounter is grabbing a chunk of files from a directory and combining them into a dataset. Such a task requires three steps. First, generating a list of files from a directory that match a pattern (e.g. all the .csv files in a directory) using the <code>list.files()</code> function. Next, looping over this list of files and loading them into R with with <code>lapply</code>, applying the <code>read.csv()</code> function to a list of files. Then, finally, using <code>do.call()</code> to <code>rbind</code>, or stack, all the loaded *.csv* files into a single dataset.

{% highlight R %}
# Grab the list of files in the directory "/home/user/foo" that end in ".csv"
csvlist <- list.files( path = "/home/user/foo",
				pattern = ".csv",
				all.files = FALSE,
				full.names = TRUE,
				recursive = FALSE )

# "Apply" the read.csv function to the list of csv files.
csvloaded <- lapply( csvlist, read.csv )

# Append the loaded .csv files into a list.
dataset1 <-do.call( "rbind" , csvloaded )
{% endhighlight %}

This is all great, but it can still take a ton of time. Note, I condense the <code>lapply</code> function and the <code>do.call</code>+<code>rbind</code> line into one.

{% highlight R %}
ptm <- proc.time()
dataset1 <- do.call( "rbind", lapply( csvlist, read.csv) )
proc.time() - ptm
> user system elapsed
> 48.840 0.148 50.241
{% endhighlight %}

If you're doing more complicated tasks or working with large sets of data, processing time can balloon.

### A faster method.

Using <a href="https://github.com/Rdatatable/data.table/wiki">the <code>data.table</code> package</a> can speed things along if we're trying to get big data into R efficiently (<a href="I highly recommend checking out the github for the project">I highly recommend checking out the github for the project</a>).<br />
The <code>rbindlist</code> function included in the package is incredibly fast and written in C. In addition the <code>fread</code> function is built to efficiently read data into R.

Below I replace the normal <code>read.csv</code> function with <code>fread()</code>, and replace <code>do.call()</code>+<code>rbind()</code> with <code>rbindlist()</code>.

{% highlight R %}
library(data.table)
dataset2 <- rbindlist( lapply( csvlist, fread ) )
proc.time() - ptm
> user system elapsed
> 4.044 0.084 4.144
{% endhighlight %}

Both methods deliver identical datasets but there are some real efficiency gains when using <code>fread</code> and <code>rbindlist</code> from the super useful <code>data.table</code> package.

{% highlight R %}
identical( dataset1, dataset2 )
> TRUE
{% endhighlight %}

This can have pretty amazing payoffs when working trying to load massive data sets into R to process.

