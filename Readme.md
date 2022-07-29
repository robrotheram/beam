
# beam

A very simple bookmark search tool. 

At work there are lots of links e.g varous projects jira / conflunce sites that becomes a pain to find as there is no interal search tool this project attempts to address. 

The core of the application is the ability to use the browsers search interface to access the bookmarks. 

By configuring beam as an additional search engine I can do `beam project name` and if its there is only 1 url for that search term I will be redirected to it otherwise I will see the a list of search results for that term 

**Authentication:** Github 
The current application authenticates all uses using github Oauth. Users can make their site private to themself (default) or choose to make it public for all users to see. 


## Tech Stack

**Client:** React, TailwindCSS

The frontend is a simple React and tailwind site to just render a list sites. 

**Server:** Go  
The backend is a go server using an embedded bleeve text search engine this is so that the entire project has no external depenancies e.g mongo or elastic search
 








## Configuring  Browser

In your Browser of choice e.g Firefox cick on settings

Go to manage search settings and add a new search engine

Give the name of the search engine e.g `beam-search`

The url will be `https://<YOUR SITE>/search?q=%s`

Set the keyword to be something like `beam`

## Configuring Authentication
In Github go to Settings and click on Developer settings
Open the OAuth Apps and create a new Apps

Add in the details of your app but important set the Authorization callback URL to be `https://<YOUR SITE>/auth`

Keep the clientid and secret safe



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


| Variable          | Description | defaut      |
| -----------       | ----------- | ----------- |
| DB_SOURCE         | Path to store the DB       |  ./gobookmark.bleve           |
| SERVER_PORT       | Port to run the server on        |  8080           |
| AUTH_GH_CLIENTID  | Github OAUTH client id        |   -          |
| AUTH_GH_SECRET    | Github OAUTH secret        |  -           |
| AUTH_CALLBACK     | OAUTH Callback must match Github setting    | http://localhost:8080/auth            |



## Authors

- [@robrotheram](https://www.github.com/robrotheram)

