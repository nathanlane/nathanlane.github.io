---
title: 'Tutorial: R Code Style for Empirical Economists'
description: >-
  Best practices and coding norms for social scientists using R, emphasizing
  readability and reproducibility over writing slick code.
publishDate: 2015-12-20T00:00:00.000Z
tags:
  - code
  - programming
  - r
  - tutorials
  - data-science
draft: true
---

![IBM's data center in the 1960s](/images/blog/assets/ibm_1280.jpg)
*Make your code understandable. IBM's data center in the 1960s, Toronto. Source: [ibm-1401.info](http://ibm-1401.info/IBM1401_ArchivePics.html)*

## Heuristics, Hunches, & Why the Heck We Care

We hear many horror stories about big names having their results over turned over because of problems in our code. The struggle is real.

With this in mind, even simple *rules of thumb* used in programming can have large payoffs for social scientists. Especially since best practices are never discussed in graduate coursework. A few good norms can go a long way in making data-driven research reproducible, sharable, and readable by collaborators.

In this post I cover some coding norms used by clean coding gurus and R developers. While I am talking to R users, I'm much of this is generalizable to Stata folks and beyond.

Now, I'm not going to get advanced here, such as discuss unit testing or object-oriented specifics. Most of us are social scientists and aren't developing applications. While "code-driven" research can learn a lot form from the craft of programming, our needs are bit a different. Gentzkow and Shapiro make a huge point in their recent work on big data practices for economists: if professionals are paying to do it is is likely important. However, I am not sure how much is practical for the social scientist.

I'll go out on a limb: researchers probably ought to emphasize readability and reproducibility over writing slick code. The programming background of collaborators varies wildly, so understandability is a must. Seldom are we working with industrial scale projects. In fact, most big data people would probably laugh at what we consider "big."

## The Broad Stuff : humbling "bang for your buck" rules

A lot of this will seem like plain common sense, of course. Then again, many of us never think to do it.

First things first, consider the *clean code theorem*, from ["The Art of Readable Code."](http://shop.oreilly.com/product/9780596802301.do)

> **A clean code theorem:** "Code should be written to minimize the time it would take for someone else to understand it."

**Consistency is key.**

Consistency goes a long way in making a code readable. This applies to the naming rules, syntax, capitalization, white spaces, how we indent, etc.. This type of rigidity makes our work more navigable. And this consistency minimizes the "WTFs per minute" we face we staring into the black hole of code we wrote a year ago.

**Comment & document like you're at risk for a head injury.**

It goes without saying, coding and documentation are huge. Many people who started off as research assistants have been admonished for not commenting enough. However, advice often stops there. However, any good programming book or style-guide spends a lot of time thinking about the way we document our work.

Comment often, but be brutally concise and to the point. Elucidate complex tasks and consider your audience. Since their backgrounds vary, seemingly simple tasks may have to be spelled out.

More is not always better however. For instance, comments easily become outdated. In fact, clean code practices in other domains can reduce the need for us to explain everything to the user. As in the case of naming, code can speak for itself.

More generally, document your work. Make documentation consistent feature of your script layouts, keeping updated descriptions in file headers.

**Use meaningful, informative names.**

Informative names make code infinitely more readable. In fact, smart naming forces us to think deeper about our code and reduces the possibility of errors.

Use concrete, descriptive words and avoid ambiguity. Nouns are used for variables—as well as for classes and attributes — and describe what they contain. Similarly, use verbs to describe functions and the action (hopefully singular) they perform. The names of script files explain what they do and end in capital R.

You would be surprised how much clean coding texts emphasize this. Consider an apt quote from the late-computer scientist, **Phil Karton**:

> "There are only two hard things in Computer Science: cache invalidation and naming things."

Try longer names, they hold more information and spare us from mysterious abbreviations. Contemporary code guides and [R convention are moving toward long names](http://www.aroma-project.org/developers/RCC). After all, solid IDEs — and new versions of RStudio — autofill variable names, reducing the cost of typing long names into out files.

> *Note: By variables I mean the objects in R/Python/etc., not to be confused by variable names used in the final output of cleaned data.*

**Layouts Matter.**

Structure your script in a coherent, organized way. A lot of time spent thinking about the structure of code — as well as writing documentation — can save heartache.

Consider [Google's R style guide suggestion for layouts](https://google.github.io/styleguide/Rguide.xml#generallayout), much of which can be applied to Stata and other languages:

```
Copyright statement comment
Author comment
File description comment, including purpose of program, inputs, and outputs
source() and library() statements
Function definitions
Executed statements, if applicable (e.g., print, plot)
```

**Write D.R.Y. Code (Don't Repeat Yourself).**

Avoid repetition and duplicated code. The habit of pasting giant chunks of code is ubiquitous in economics. However, this practice is a cardinal sin among developers. Errors propagate and multiply. Fixing errors becomes complicated.

Consider a bastardization of the famous "rule of three", from Martin Fowler's seminal book on refactoring: First, we write code to get the job done. Second, we shudder and duplicate what we did. The third time, we think a little more deeply about how to rework (in coding parlance, "refactor") and streamline out code. In other words, ask yourself: can I generalize what I'm doing in a concise way?

**Modularize.**

Breaking code into re-usable, independent chunks will make code easier to read and debug.

Functions play a key role in modularization. Use them often, keeping them short and specific to a task. *(Note: I recommend [Cosma Shalizi's notes on writing good R functions](http://www.stat.cmu.edu/~cshalizi/402/programming/writing-functions.pdf) and the [Clean Code github's function tutorial](http://nicercode.github.io/guides/functions/))*

Limit your *actual script files*. Split them into two files if necessary. At minimum, you should divide analysis and data preparation. Jonathan Nagler of NYU Polisci. [explains why](http://www.nyu.edu/classes/nagler/quant2/coding_style.html):

> "Separating data-manipulation and data-analysis is an example of modularity. ... The logic for this is simple. Lots of things can go wrong. You want to be able to isolate what went wrong. You also want to be able to isolate what went right."

**Refine and Refactor.**

Code should improve through time. Clean code gurus repeat a code of conduct adopted from the U.S. Boy Scout dictum:

> "Leave the ~~campground~~ code cleaner than you found it"
>
> -[Bob Martin's "Clean Code: A Handbook of Agile Software Craftsmanship"](http://amzn.com/0132350882)
