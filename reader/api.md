About the REST API
==================

The reader is using a REST API which supports writing external apps.

The base URL for the REST service is [https://reader.tidhr.com/rest](reader.tidhr.com/rest). You can use HTTPS or HTTP.

Resources
---------

Our API resources are usually JSON objects.

These objects may contain partial child objects from other online resources if the child object has `$ref` property which points to an another online resource. Exception 
is if the object itself has `$ref` as the first level property -- then it is the link to the resource itself.

GET /rest
-----

Sample output:

```json
{
   "profile" : {
      "$ref" : "http://reader.tidhr.com/rest/profile"
   },
   "feeds" : {
      "$ref" : "http://reader.tidhr.com/rest/feeds"
   },
   "access_token" : {
      "profile" : true,
      "part_feed" : false,
      "edit_profile" : true,
      "import_feed" : true,
      "description" : "Bot",
      "bots" : true,
      "users_id" : null,
      "read_feed" : true,
      "edit_pages" : true,
      "join_feed" : true,
      "debug" : true,
      "token" : "6ef1b3b68a60aa2749e5f1b1c1dbef40",
      "pages" : true
   },
   "auth" : {
      "$ref" : "http://reader.tidhr.com/auth"
   },
   "authorizations" : {
      "$ref" : "http://reader.tidhr.com/rest/authorizations"
   },
   "register" : {
      "$ref" : "http://reader.tidhr.com/rest/register"
   },
   "bots" : {
      "$ref" : "http://reader.tidhr.com/rest/bots"
   },
   "debug" : {
      "$ref" : "http://reader.tidhr.com/rest/debug"
   },
   "pages" : {
      "$ref" : "http://reader.tidhr.com/rest/pages"
   }
}
```

Possible optional properties for this resource are `feeds`, `debug`, `bots`, `profile`, `authorizations`, `access_token`, `register`, `pages`, and `auth`.

These properties are included only if your access token or authorized session has correct priviledges. Some resources are public.

### GET /rest/pages

Get all pages.

Sample output:
```json
[
   {
      "title" : "About",
      "$ref" : "http://reader.tidhr.com/rest/pages/about"
   },
   {
      "title" : "API",
      "$ref" : "http://reader.tidhr.com/rest/pages/api"
   }
]
```

### GET /rest/pages/:name

Get specific page by `name` property.

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
   "$ref" : "http://reader.tidhr.com/rest/pages/about"
}
```

### POST /rest/pages

Requires `edit pages` priviledge.

Adds new page.

Example input body (with `application/json` content type):

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
}    
```

### POST /rest/pages/:name

Requires `edit pages` priviledge.

Updates the page content.

Example input body (with `application/json` content type):

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
}    
```

### DELETE /rest/pages/:name

Requires `edit pages` priviledge.

Delete the page by `name`.

### GET /rest/authorizations

Requires `profile` priviledge.

Example output:
```json
[]
```

### GET /rest/authorizations/:access_token

Requires `profile` priviledge.

Example output:
```json
```

### DELETE /rest/authorizations/:access_token

### POST /rest/authorizations
/rest/debug

### GET /rest/profile

### POST /rest/profile

### GET /rest/register

### POST /rest/register

### POST /rest/bots

### GET /rest/bots

### DELETE /rest/bots/:bot_id

### GET /rest/bots/:bot_id

### GET /rest/bots/:bot_id/feeds

### POST /rest/feeds

### DELETE /rest/feeds/:feed_id

### GET /rest/feeds

### GET /rest/feeds/:feed_id

### GET /rest/feeds/:feed_id/items

### POST /rest/feeds/:feed_id

### POST /rest/feeds/:feed_id/items

### GET /rest/feeds/:feed_id/items/:feed_item_id

/auth
-----

Some passport related APIs are located at [https://reader.tidhr.com/auth/](reader.tidhr.com/auth/).

GET output:

```json
{
   "facebook" : {
      "$ref" : "https://reader.tidhr.com/auth/facebook"
   },
   "github" : {
      "$ref" : "https://reader.tidhr.com/auth/github"
   },
   "local" : {
      "$ref" : "https://reader.tidhr.com/auth/local"                                                                                                                             
   }                                                                                                                                                                             
}  
```
