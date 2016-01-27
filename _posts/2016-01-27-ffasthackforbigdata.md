---
layout: post
title: "Quick Note: Using 'ff' to write giant data.tables in R"
type: post
published: true
author:
  "Nathaniel"
---

Right now, I am having to repeatedly manipulate and save a hundred datasets, each with around 4 million observations. While R tools like <code>fread()</code>, part of __[the <code>data.table</code> library](https://cran.r-project.org/web/packages/data.table/index.html)__, make it trivial to load massive datasets into memory, *writing* big datsets--muchless doing so repeatedly--is another story..

When trying to save big datasets, many of folks first recommend the <code>write.table()</code> function, which gives some people some performance gains over <code>write.csv()</code> or <code>write.csv2()</code>. For my project, <code>write.table()</code> this wasn't cutting it. My system was constantly crashing. When it wasn't crashing, it was saving data at a snail's pace.

Enter the __[<code>ff</code> library](https://cran.r-project.org/web/packages/ff/index.html)__, an incredibly handy tool for working with big data. In fact, <code>ff</code> nimbly deals with some of R's serious memory issues (__[see a more technical guide here.](http://ff.r-forge.r-project.org/bit&ff2.1-2_WU_Vienna2010.pdf)__).

Below I take a data.table object I was manipulating (perhaps in a loop), convert it into an "ff dataframe" (ffdf), which I can then save using <code>ff</code>'s speedy saving function.

### A simple alternative to write.table():
{% highlight R %}

library(magrittr) # For use of piping %>%.
library(data.table) # I use data.table to manipulate large datasets.
library(ff) # And the key package we'll use to save.

  # Say up here I perform a bunch of data.table manipulations..

  # Start with data.table object,
  mygiant_datatable %>%

    # ... transform it into an ff dataframe,
    as.ffdf( . ) %>%

    # Write the ffdf object using ff's csv writing function.
    write.csv.ffdf( . , file="/my/file/path/myfile.csv")
{% endhighlight %}


The type of data table (mygiant_datatable) I am working with is simple, so coercing it into an ffdf object is no problemo.

Of course, in the cheap workaround above, the <code>as.ffdf()</code> adds a costly step (time-wise). However, it was well worth the benefit of utilizing the <code>write.csv.ffdf()</code> function ... and worth not crashing *ad nauseum*.
