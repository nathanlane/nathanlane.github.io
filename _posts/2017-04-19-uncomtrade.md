---
title: Building a Dataset from UN Comtrade's API
date: 2017-04-19 00:00:00 Z
tags:
- rstats
layout: post
type: post
status: publish
author: Nathaniel
---

The following is a simple program for building data sets using the United Nation's COMTRADE API. 

Note: this code does not apply to the "Bulk download" API, which allows users to download entire chunks of annual or monthly data. Instead, this program is for making specific, repeated queries for import (export) data between certain countries.


#### 1. First Things First: Some Prepation. 

My script loops over lists of reporting countries and their counterparts.
I have these lists saved as CSV files. 

The UN Comtrade system uses its own coding scheme. Thus, we do not make queries based on country names, but using their identifiers found here <a href = "https://unstats.un.org/unsd/tradekb/Knowledgebase/Comtrade-Country-Code-and-Name" target = "_blank">coding scheme</a>. 

I have list of countries and their corresponding codes saved as .csv files. I have a trade partner list (uncomtrade_partners.csv) and list of reporting countries (uncomtrade_reporting.csv), both of which have the following layout:

<div>
<img src="{{ site.baseurl }}/assets/comtradelist.png" />
</div>

The countries I wish to query have a column (data.frame$V3) with a 1 indicating the country I wish to include in my query.

The following code sets takes these .csv files, and creates two lists of UN COMTRADE codes that correspond to the reporting countries I want and the partner countries I want.


{% highlight R %}
## TOP MATTER

# Libraries.
library(rjson)
library(magrittr)
library(httr)
library(RCurl)
library(rvest)
library(data.table)

# A directory where we save things.
/your/file/path -> project_directory


## PREPARE COUNTRY LISTS  

# Deal with partner country list.
"uncomtrade_partners.csv" %>% 
  file.path( codelist_path , . ) %>%
  read.csv( . ) -> partners_dummies

# Get partner list.
partners_dummies[ which( partners_dummies$V3==1 ),] %>%
  .$V1 %>%
  as.vector( . ) -> partners_slist

# Deal with reporting country list.
"uncomtrade_reporting.csv" %>%
  file.path( codelist_path , . ) %>%
  read.csv( . ) -> reporting_dummies 

# Get reporting country list
reporting_dummies[ which( reporting_dummies$V3==1 ) ,]  %>%
  .$V1 %>%
  as.vector( . ) -> reporting_list

{% endhighlight %}


#### 2. The Meat: Querying and Saving Data Chunks

Next I define two programs. 

The first program is a file for retreiving the UN COMTRADE data in (.csv) form from the <a href="https://comtrade.un.org/data/doc/api/" target="_target">UN COMTRADE's bulk download API</a>.

The following code is based loosely on <a href="https://comtrade.un.org/data/doc/api/" target="_target">COMTRADE's own R code</a>

One important distiction between this code and mine is that I found that on non-Windows computers, the UN's code didn't handle HTTPS very well. In fact, using their code I tended to get connection errors, in particular,

{% highlight R %}
Error in curl::curl_fetch_memory(url, handle = handle) : 
 Peer certificate cannot be authenticated with given CA certificates  
{% endhighlight %}

Yup, an HTTPS related error.

Thus, the line <code>set_config( config( ssl_verifypeer = 0L ) )</code> deals with R's HTTPS issues (<a href="https://www.r-bloggers.com/fixing-peer-certificate-cannot-be-authenticated/" target="_target">As reported here</a>). 

Finally, <code>read.csv( text = content( GET(string), as="text" , type = "text/csv" , header = TRUE ))</code> _properly_ retrieves a concatenated HTTPS URL stored in the <code>string</code>, and parsing the retrieved text content into a coherent .CSV table. (The function deals with .JSON-based queries in similar ways, but I just prefer .CSV data.)


{% highlight R %}

## PROGRAM 1. GET DATA FROM THE UN COMTRADE API.

# First deal with HTTPS.
httr::set_config( config( ssl_verifypeer = 0L ) )

# Define UN COMTRADE RETRIEVAL FUNCTION.
get.Comtrade <- function( url="https://comtrade.un.org/api/get?"
                          , maxrec=50000
                          , type="C"
                          , freq="A"
                          , px="HS"
                          , ps="now"
                          , r
                          , p
                          , rg="all"
                          , cc="TOTAL"
                          , fmt="json" )
  
{
  
  # Tell us where we are.
  paste( "Querying reporting country", r , 
         "trade with" , p , 
         sep = " " ) %>% 
    print( . )
  
  # The URL string constructed from function arguments.
  string <- paste(url
                  ,"max=",maxrec,"&" #maximum no. of records returned
                  ,"type=",type,"&" #type of trade (c=commodities)
                  ,"freq=",freq,"&" #frequency
                  ,"px=",px,"&" #classification
                  ,"ps=",ps,"&" #time period
                  ,"r=",r,"&" #reporting area
                  ,"p=",p,"&" #partner country
                  ,"rg=",rg,"&" #trade flow
                  ,"cc=",cc,"&" #classification code
                  ,"fmt=",fmt #Format
                  ,sep = ""
  )
  
  # How to process .csv OR the .json data.
  if( fmt == "csv" ) {
    
    # Read.csv.
    data <- read.csv( text = content( GET(string), 
                                      as="text" ,  
                                      type = "text/csv" , 
                                      header = TRUE ))
    
    # Make dataset into datatable. 
    save.Comtrade( data , px , ps , r , p ) 
    
  } else {
    
    if(fmt == "json" ) {
      
      # Access URL properly and retrieve JSON.
      retrieved_url <- content( GET( string ) , 
                                  as ="text" ,
                                  type = "text/html" )
      raw.data <- jsonlite::fromJSON( retrieved_url )
      
      # Turn into dataframe
      data <- as.data.frame( raw.data )
      colnames( data ) <- names( data )
       
      # Make dataset into datatable. 
      save.Comtrade( data , px , ps , r , p ) 
      
    }
  }
}

{% endhighlight %}

The second program simply saves each date query.

Specifically, within the <code>get.Comtrade()</code> function above, we dumped our queried .CSV tables into a local directory. (As opposed to holding them in memory, given R's funky memory issues). This was done using our function, <code>save.Comtrade()</code>, which takes an individual data.frame and saves it using <code>write.csv()</code>.


{% highlight R %}

## PROGRAM 2. SAVE PREPARED DATA.FRAME AS CSV.

# Path for raw UN comtrade queries.
file.path( working_path , 
           "data" , 
           "uncomtradequeries" ) ->  rawcomtrade_path

  
## ... Takes argumenents from main function get.Comtrade
save.Comtrade <- function( dataset_argument , px , ps , r , p ){
  
  # Prepare file name, pass to fast writing CSV method.
  paste( "trade" , 
          px , 
          ps, 
          r , 
          p , 
          "raw.csv" , 
          sep = "_" ) -> filename
  
  # Tell us where we are.
  paste( "Saving dataset for reporting country", r , 
         "trade with" , p , 
         sep = " " ) %>% 
    print( . )
  
  # Concatenate the project directory and filename.
  filename %>%
    file.path( project_directory , . ) %>%

    # Save the dataset as a CSV.
    write.csv( dataset_argument , file = . )  
  
}

{% endhighlight %}

#### 3. Making Multiple Queries Using mapply()

The <code>mapply()</code> function runs the <code>get.Comtrade()</code> UN COMTRADE retrieval program, doing so for each combination of countries from the __reporting_list__ and the __partners_list__ generated in Part 1 -- holding a list of parameters constant with <code>MoreArgs</code>. 


{% highlight R %}

## EXECUTE QUERY FOR ALL COUNTRY PAIRS.

# Build array (actually, data.frame) of arguments for function:
argument_array <- expand.grid( partner_arguments = partners_list , 
                               reporting_arguments = reporting_list )

# Show arguments array:
argument_array


# Take multiple arguments and apply the function.
mapply( get.Comtrade ,
        r = argument_array$reporting_arguments ,
        p = argument_array$partner_arguments , 
        MoreArgs = list( ps = "all" , 
                         fmt = "csv" ,
                         rg = "1" , 
                         px = "h0" , 
                         cc = "all") ) 

{% endhighlight %}

Again, <code>mapply()</code> is like a loop, applying the API querying function to each reporting+partner country combination. However, we cannot directly use the _reporting_list_ and the _partners_list_ as the two argument lists in <code>mapply()</code> (doing so won't generate a complete list of combinations). Instead, we use the <code>expand.grid()</code> function to generate all reporting+partner country combinations; and this table gives us two columns, <code>argument_array$reporting_arguments</code> and <code>argument_array$partner_arguments</code>, which are the actual country argument lists used by <code>mapply()</code>.

While <code>mapply()</code>'s main value added is cycling over many argument lists, we want to hold some <code>get.Comtrade()</code> arguments constant. To do so, we supply a list of arguments to <code>MoreArgs</code>. The parameters we hold costant are in the list, <code>list( ps = "all" , fmt = "csv" , rg = "1" , px = "h0" , cc = "all")</code>. 

#### 4. Stacking Saved Data Chunks into a Dataset

Together, <code>mapply()</code> and <code>get.Comtrade()</code> repeatedly queried and saved each chunk of queried data to a directory . However, 100s of data chunks are hardly useful as a dataset. We was to assemble the pieces into a single coherent dataset.

Thus, the following program assembles our saved queries into a coherent dataset.


{% highlight R %}
## MAKE DATASET OUT OF ALL SAVED FILES

## Make list of files we saved locally to the project path.
csvfile_list <- list.files( path = project_directory ,
                            pattern = "trade_h0.*.csv" , 
                            all.files = FALSE ,
                            full.names = TRUE , 
                            recursive = FALSE )

# Lapply the rest of the files to the main.dt file 1.
lapply( csvfile_list , fread , sep = "," ) %>% 
  rbindlist( . , fill = TRUE ) -> main.dt


# Save the stacked CSV.
write.csv( main.dt , 
           file = file.path( project_directory , 
           "thebigdataset.csv" ) )


{% endhighlight %}


The above code makes a list of all the files in _/your/file/path_ that match our naming scheme, <code>_trade_h0_all_[REPORTING COUNTRY]_[PARTNER COUNTRY]_raw.csv_</code>.

Next, we efficiently open all these files and stack them into a coherent dataset. We use <code>lapply()</code> to loop over the list of .csv files and open each using nimble <code>fread()</code> function (from the wonderful __data.table package). The list of opened datasets are then "stacked" into a single dataset using <code>rbindlist()</code>.

Finally, we we save the assembled dataset to our local direction, _/your/file/path_. You can use your preferred method of course, especially if you run into memory problems writing large .CSV files with R (I prefer using the experimental<code>fwrite()</code> function in the data.table package, __<a href = "http://nathanlane.info/tutorial/2017/03/31/writingwithfwrite.html">which I discuss here</a>.__).