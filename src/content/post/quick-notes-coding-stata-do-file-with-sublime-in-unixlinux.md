---
title: Quick Notes - Coding Stata do-files with Sublime in...
description: >-
  I am used to writing code in notepad programs, such as N++ and the fantastic
  Sublime Text 3...
publishDate: '2015-11-20'
tags:
  - howtos
  - tutorials
  - links
  - programming
draft: true
---


I am used to writing code in notepad programs, such as N++ and the <code><a href="http://www.sublimetext.com/3">fantastic Sublime Text 3</a></code>. Here's a quick note on connecting a powerful coding notepad in Linux to Stata.

&nbsp;

Sublime, like many of these programming-oriented editing notepads, have massively powerful tools that crush Stata's default editor. Moreover, since many people are simultaneously juggling Python, R, and Stata (and more) scripts for a single project, the ability to work from one programming-oriented environment is nice.

&nbsp;

While it is straightforward to run Stata do-files from Sublime Text in Mac OS and Windows, using packages like Sublime Stata Enhanced, it wasn't obvious how to do so in Linux. The following is a little integration guide, which is <code><a href="https://github.com/rhoconlinux/Stata-12-in-Sublime-3-under-Ubuntu">indebted to this Github howto here</a></code>.

####  Sublime, Stata & Unix Walk Into a Bar:

&nbsp;

First, from your terminal create symbolic links for <code>xStata</code> and <code>Stata</code> commands. The gist of creating a link in the terminal is the following,

<pre>ln -s *[target-filename]* *[symbolic-filename]*</pre>
<pre>
sudo ln -s /usr/local/stata14/xstata /usr/local/bin/xstata && sudo ln -s /usr/local/stata14/stata /usr/local/bin/stata
*#[sudo will prompt you for your password]*
</pre>

Of course you can edit this to match the version of Stata (and flavor) you are using.<br />
&nbsp;<br />
The following Stata package definitely works in Linux, so we'll use it! Download it from <code><a href="https://github.com/rpowers/sublime_stata">https://github.com/rpowers/sublime_stata .</a></code><br />
&nbsp;<br />
Within the ZIP file from is a /Stata directory--find it and place it in the Sublime /Packages directory on your Linux system. If you're new to Linux, this file is likely in the folder <code>/[your user name]/.config/sublime-text-3/Packages</code>. Notice, sometimes these files are hidden from the user in the terminal so they may be hard to find. Confirm that the files appear with, typing <code>ls -ld .?*</code> in the command line.<br />
&nbsp;<br />
Last, open the Stata.sublime-build file located in <code>/.config/sublime-text-3/Packages/Stata/</code> directory. Replace all the text with the following,

<pre>
 { "cmd": ["xstata do $file"], "file_regex": "^(...?):([0-9]):?([0-9]*)", "selector": "source.stata", "shell": true, }
</pre>

Seriously--just copy and paste over the stuff in the original text file. Save, restart Sublime Text for safe keeping, and you're good to go.<br />
&nbsp;<br />
Now when you use Sublime Text, , simply typing <code>ctrl+b </code> executes Stata externally and runs the do-file you're currently editeing.<br />
&nbsp;<br />
*Note: for some reason I have run across some issues running do files in batch mode from the Unix terminal and such. I found adding an extra space at the end of my code, or a superfluous <code>log close</code> does the trick.*<br />
&nbsp;<br />
&nbsp;

#### References:

<li>Sublime Text 3: <code><a href="http://www.sublimetext.com/3">http://www.sublimetext.com/3</a></code>.</li>
<li>Rhocon's github article for a similar approach: <code><a href="https://github.com/rhoconlinux/Stata-12-in-Sublime-3-under-Ubuntu">https://github.com/rhoconlinux/Stata-12-in-Sublime-3-under-Ubuntu</a></code>.</li>
<li>State Enhanced for Sublime from rpowers (used on Linux systems): <code><a href="https://github.com/rpowers/sublime_stata">https://github.com/rpowers/sublime_stata</a></code>
</li>
<li>Symbolic links in Unix: <code><a href="http://faculty.salina.k-state.edu/tim/unix_sg/advanced/links.html">http://faculty.salina.k-state.edu/tim/unix_sg/advanced/links.html</a></code></li>
<li>Sublime+Stata usage in Window and OSX: <code><a href="https://github.com/andrewheiss/SublimeStataEnhanced">https://github.com/andrewheiss/SublimeStataEnhanced</a></code>
</li>
