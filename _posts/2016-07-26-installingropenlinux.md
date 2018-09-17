---
title: 'Quick Note: Upgrading to Microsoft Open R in Linux'
date: 2016-07-26 00:00:00 Z
layout: post
type: post
author: Nathaniel
---

<img src = "{{ site.baseurl }}/assets/firstwheelie.jpg" width = "700px" >


Below is a guide to installing Microsoft Open R for those using Ubuntu Linux and R-Studio. Microsoft R Open (MRO) is a pretty powerful distribution of R (and yes, completely open source). It builds off (currently) R version 3.3.0, adding some darn useful enhancements, due in part to their use of Intel's Math Kernel Library (MKL). 

<h4>What is R Open + MKL?</h4>

What does this mean? Basically Microsoft R Open is an optimized version of your standard R, and can help tremendously if you're doing, say, many intense vector or matrix-based operations. Importantly, much of this is done for you: instead of having to fiddle around with multi-core support in your code, R Open optimizes things automatically.

Before stumbling across Revolution R, the predesessor to Microsoft R Open, I didn't know there were <strong>other</strong> distributions of R floating around. Switching to Microsoft R Open simply means you're installing an enhanced version of R over the default version. <strong>Everything</strong> works the same. There is nothing special you have to do (other than installing your previous packages, which is covered below). If you're using RStudio, like most people out there, RStudio will automatically use the new, enhanced R.

<h4>Upgrading to R Open</h4>

Before installing <a href="https://mran.revolutionanalytics.com/open/
">Microsoft R Open</a>, you want to keep track of all the packages you’ve installed. Because we’re installing a new version of R underneath RStudio, we wont have access to our old packages.

The following R code saves a list of packages that are currently installed in R. A <code>.Rda</code> file containing the installed package list will be saved in your default working directory. (If you need a reminder of your current working directory type <code>getwd()</code> into R.)

{% highlight R %}
# Save a list of packges install in R.
temp <- installed.packages()
installedpackages <- as.vector( temp[ is.na( temp[ , "Priority" ] ) , 1 ] )
save( installedpackages , file = "oldpackages.rda" )
{% endhighlight %}

<small>
The above code is essentially the same as <a href="https://www.datascienceriot.com/how-to-upgrade-r-without-losing-your-packages/kris/">Data Science Riot</a>.
</small>

Once we setup R Open, we’ll evoke this <code>.Rda</code> file to automatically (re-)install the old packages.

Next, we download and install Microsoft R Open: <a href="https://mran.revolutionanalytics.com/download/#download">https://mran.revolutionanalytics.com/download/</a>. 

If, like me, you juggle multiple systems and can’t keep track of which version of Ubuntu you have, type the following command into the terminal:

{% highlight bash %}
From your terminal:
lsb_release -a
{% endhighlight %}

Then download the appropriate version of R Open <strong>and</strong> the MKL libraries.

After downloading, first install the Microsoft R Open Debian package:

{% highlight bash %}
sudo dpkg -i ./Downloads/MRO-3.3.0-Ubuntu-15.4.x86_64.deb
sudo apt-get install -f
{% endhighlight %}

Next install the MKL libraries by unzipping and then running the installation script located in the <code>/RevoMath</code> directory:

{% highlight bash %}
tar xvfz ./Downloads/RevoMath-3.3.0.tar.gz
cd RevoMath
./RevoMath.sh
{% endhighlight %}

If everything has gone smoothly, the extra math libraries will have now been installed onto your system.

Now, re-open RStudio. Magically (and hopefully), RStudio should recognize the new R Open program and automatically setup the multi-core support. I have installed R Open on all my systems and have never had issues with RStudio recognizing the new flavour or R. If things have gone well, you should see the following message in the console RStudio console:

{% highlight R %}
Microsoft R Open 3.3.0
Default CRAN mirror snapshot taken on 2016-06-01
The enhanced R distribution from Microsoft
Visit https://mran.microsoft.com/ for information
about additional features.

Multithreaded BLAS/LAPACK libraries detected. Using 4 cores for math algorithms.
{% endhighlight %}

The message confirms that the combination or Microsoft R Open and the associated libraries have blessed you with multi-core support. Which saves you from having to setup a multi-core "by hand."

Now that RStudio "sees" Microsoft R Open as our default version of R, we return to our <code>.Rda</code> file and use it to automatically install all the old packages:

{% highlight R %}
load( "oldpackages.rda" )
temp <- installed.packages()
installedpackages.new <- as.vector( temp[ is.na( temp[ , "Priority" ] ) , 1 ] )
missing <- setdiff( installedpackages , installedpackages.new )
install.packages( missing )
update.packages()
{% endhighlight %}


If you're like me, you may have sit back for a while and watch R hypnotically re-install the list of packages onto your distribution.
