---
title: Input-Output Tables & the Leontief Inverse in R - Part I.
date: 2016-07-11 00:00:00 Z
categories:
- Tutorial
- Input-Output
layout: post
type: post
author: Nathaniel
---

<img src="{{ site.baseurl }}/assets/surahammarssweden.jpg" width="700px"/>
<small>Surahammars Ironworks/Surahammars Järnbruk, Sweden, 1919.  
<a href="www.tekniskamuseet.se/1/706.html">From Sweden's Tekniska Museet photo collection</a>.</small>


In input-output economics, the <strong>Leontief inverse</strong> (i.e. [I-A]^-1) is ubiquitous. Named after the father of input-output economics, <a href="http://www.nobelprize.org/nobel_prizes/economic-sciences/laureates/1973/leontief-bio.html">Wassily Leontief</a>, the matrix is a compact representation of the ripple effects in an economy where industries are interconnected. A lone matrix coefficient conveys all direct and indirect effects on output in one sector required by a unit of output from another sector. 

Below is Part 1 of a two part tutorial on deriving the Leontief inverse using R. This first part is a "toy" example to motivated the pieces of the input-output analysis and the workflow in R. Part 2 describes how to calculate the Leontief inverse from a full scale input-output table.

<h4>A Toy Input-Output Model.</h4>

Consider a baby example. I'll use <strong>Table 1</strong> as a guide to calculating a simple Leontief inverse using R. The table represents the essential ingredients of common input-output tables using only two sectors.

<strong>Table 1. A Small Input-Output Table</strong>

<table>
<tbody>
<tr>
<td> </td>
<td colspan="2"><center>Intermediates</center></td>
<td> </td>
<td> </td>
</tr>
<tr>
<td>From / To</td>
<td>Good 1</td>
<td>Good 2</td>
<td>Final Goods</td>
<td>Total Output</td>
</tr>
<tr style="border-top:1px solid darkgray;">
<td>Good 1</td>
<td>150</td>
<td>500</td>
<td>350</td>
<td>1000</td>
</tr>
<tr style="border-top:1px solid darkgray;">
<td>Good 2</td>
<td>200</td>
<td>100</td>
<td>1700</td>
<td>2000</td>
</tr>
</tbody>
</table>
<small>The above example borrows from the canonical examples in chapter 2 of Miller and Blair's <u>Input-Output Analysis</u> (1985) as well as chapter 2 of Leontief's <u>Input-Output Economics</u> (1986).
</small>

The heart of the table is a two-by-two matrix representing the intermediate good flows between the two sectors: sector 1 and sector 2. A row represents the value of output sent from a goods sector for productive use in a column sector. Above, a row sector sends goods to itself and sector 2. 

After the two columns of intermediate good sales, the "Final Goods" column shows the value of a row's output used as final products--output not used in production. If we add up a row's output used as intermediate goods and as final products, we get the last column: total output.

<h4>Calculating the Matrix</h4>

The Leontief inverse is calculated in the following way. We start with an IO table like the one above. Using this basic IO table, we generate a "technical coefficient matrix," which we then use to solve for the Leontient inverse matrix, L.

$$
\textrm{Basic IO Table: }~ X \Rightarrow \textrm{Technical Matrix: }~ A \Rightarrow \textrm{Leontief Matrix: }~ L
$$

First we'll build the input-output table in Table 1 using R. We generate the two-by-two flow of interindustry sales (<code>flowtable</code>). Then I create the vector of <code>finaldemand</code>. 

{% highlight R %}
# Intermediate flow matrix.
flowtable <- rbind( c( 150 , 500 ), c( 200 , 100 ) )
# Final demand.
finaldemand <- rbind( c( 350 ), c( 1700 ) )
{% endhighlight %}

We combined these pieces into a <code>data.frame</code> object. Once combined, we sum across the intermediate input columns and final demand column to produce a new variable: total demand. The result is a <code>data.frame</code> version of Table 1.

{% highlight R %}
# Bind into input-output table.
inputoutputtable <- cbind( flowtable , finaldemand )

# Convert object to data.frame.
inputoutputtable <- as.data.frame( inputoutputtable )

# Name columns of table (dataframe)
names( inputoutputtable ) <- c("x1" , "x2" , "finaldemand")

# Calculate total output, add final demand and intermediate columns:
inputoutputtable$totaloutput <- inputoutputtable$x1 +
                                inputoutputtable$x2 +
                                inputoutputtable$finaldemand

# Show the small IO table.
inputoutputtable
>   x1  x2 finaldemand totaloutput
>1 150 500         350        1000
>2 200 100         1700       2000

# Save total output vector as a separate object. Use later.
totaloutput <- inputoutputtable$totaloutput
{% endhighlight %}

Now we can derive a <strong>technical coefficient matrix</strong>, also called <strong>matrix A</strong>. A column of this matrix represents an industrial recipe used to produce a single industry good. 

Matrix A is calculated by dividing intersectoral flows by the total output of each column's sector. Specifically, sector 1 ships 500 dollars of good 1 to sector 2, which produces 1000 dollars of total output. Thus, one dollar of good 1 is absorbed to produce 25 cents of sector 2's output.

$$
\textrm{Input Flow Matrix: }~X  = \left[ \begin{matrix} 150 & 500 \\\ 200 & 100 \end{matrix} \right]~
\\\
z = \textrm{I}_2 \textrm{Total Output}^{-1} =\left[ \begin{matrix} 1 & 0 \\\ 0 & 1 \end{matrix} \right] \left[ \begin{matrix} 1000 \\\ 2000 \end{matrix}   \right]^{-1}~
$$

$$
\textrm{Technical Coefficient Matrix: }~A = Xz \Rightarrow A = \left[ \begin{matrix} .15 & .25 \\\ .2 & .05 \end{matrix} \right]
$$

To calculate matrix A in R: first take the inverse of the total output vector and multiply it with an identity matrix. The resulting object, <code>z</code>, is multiplied again with the <code>flowtable</code> matrix. 

{% highlight R %}
## Calcate coefficient matrix:
z <- ( totaloutput )^-1 * diag( 2 )
A <- flowtable %*% z

# Show A
A
     [,1] [,2]
[1,] 0.15 0.25
[2,] 0.20 0.05

{% endhighlight %}

Alternatively, we can use R's <code>sweep()</code> function to calculate A directly from the <code>flowmatrix</code> and the <code>totaloutput</code> vector. <code>sweep()</code> takes the input matrix and divides each column by the corresponding entry of the vector. The argument <code>margin = 2</code> tells us we're "sweeping" over the columns of the input matrix, as opposed to rows (for row-wise calculations, <code>margin = 1</code>).

{% highlight R %}
# Using "Sweep"
A.alternative <- sweep( flowtable , 
						margin = 2 , 
						totaloutput , 
						'/' )
A.alternative
     [,1] [,2]
[1,] 0.15 0.25
[2,] 0.20 0.05
{% endhighlight %}

Finally, the Leontief matrix is calculated in the following way.

$$
\textrm{Leontief Matrix: }~ L = (\textrm{I}_2 - A)^{-1} \Rightarrow L = \left[ \begin{matrix} 1.2541 & .33 \\\ .264 & 1.1221 \end{matrix}  \right]
$$

Using R, we first calculate <code>I-A</code>, substracting the technical coefficient matrix from the identity matrix. We then invert the I-A matrix by using the<code>solve()</code> function. The result, <code>L</code>, is the Leontief coefficient matrix. 

{% highlight R %}

# Identity matrix minus technical coefficient matrix.
IminusA <- diag( 2 ) - A

## Calculate inverse.
L <- solve( IminusA ) 

# Show Leontief matrix.
L
          [,1]     [,2]
[1,] 1.2541254 0.330033
[2,] 0.2640264 1.122112

{% endhighlight %}

Substantively, the matrix L summarizes the network effects generated when final output changes. A single coefficient of matrix L, surprisingly, summarizes <strong>all</strong> direct and indirect effects created in sector <strong>i</strong> to supply a single unit of final demand for sector <strong>j</strong>.




