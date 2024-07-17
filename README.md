Wed Jul 17 05:53:16 EDT 2024

# Visualizing Data from the Github Search API

 - Build an application that reads data from a public API
   and uses D3 to build an interactive bar chart based on that data.
 - We'll be reading data from the GitHub Search API.
   - This API allows you to search for data on GitHub, a service that
     hosts Git repositories. -- Git is a popular version control system
     for keeping track of software project source code.
   - The API uses the HTTPS protocol and returns JSON-formatted data
     based on a search query you encode into a URL.

### Fetching Data
 - Try getting some data from the GitHub Search API.
   - To do this, format the request for data as part of the URL.
     Visiting that URL retrieves the data.
   - The URL to include the search query will be the following:
     [ https://api.github.com/search/repositories?q=language%3Ajavascript%20stars%3A%3E10000&per_page=20&sort=stars ]

   - The URL has two parts: a base URL, which gives us acces to the API,
     and a query string, where we specify what data we want.
   - These two parts are separated by a question mark (?).
   - The query string contains pairs of keys and values that are used to
     send information to the API about the query being made.
     - Each key and value is joined by an equal sign (=), and each key-value
       pair is separated by an ampersand (&).
    
   #### Only a limited set of characters ALLOWED
    - In this URL, the keys are q (search queary), per_page (number of results per page),
      and sort (how to sort the results).
    - The keys and values in query strings are allowed to contain only a limited set of 
      characters: a-z , A-Z , 0-9 , hyphen (-) , period (.) , underscore (_) , tilde (~) ,
      and a limited set of other special characters.
    - All other characters **must be represented** using the URL **encoding** system, which
      is where all the percents (%) characters in the URL come from
      - For example, a **colon** (:) is encoded as %3A and a **space** is encoded as %20
    
    #### Creating the URL
    - To simplify things, we'll write a function that takes an object with the unecoded query
      string parameters and converts it to a properly formatted and encoded URL.
    
    #### Fetching JSON data
     - To bring the JSON data into your application you can use D3's json helper method
       -> `d3.json(url)`
       - Which fetches JSON from a given URL
       - Fetching a bunch of data from an API may take a little time, so the
         d3.json method returns a Promise,
         - A type of object that represents something that will be available in
           the future.
       - The `.then` method takes a function that will be called when the data
         is ready.
       - D3 converts the JSON response string into a JavaScript object, so `data`
         will be an object