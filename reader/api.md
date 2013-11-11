About the REST API
==================

Our [reader.tidhr.com](https://reader.tidhr.com) has also a REST API with 
support for external 3rd party apps. This document describes the API.

The base URL for our REST service is 
[https://reader.tidhr.com/rest](reader.tidhr.com/rest). You can use HTTPS or 
HTTP.

Our frontend has been built by using this API.

******************************************************************************


1. Access Tokens
----------------

Users can create their own access tokens after log in at 
[https://reader.tidhr.com/authorizations](https://reader.tidhr.com/authorizations). 

***Please note:*** You must save the content in the provided `token` and 
`secret` properties or otherwise that access token is useless. You cannot get 
the value of `secret` if you don't save it!

******************************************************************************


2. Resources
------------

Our API resources are usually JSON objects.

These objects may contain partial child objects from other online resources if 
the child object has `$ref` property which points to an another online 
resource. Exception is if the object itself has `$ref` as the first level 
property -- then it is the link to the resource itself.

******************************************************************************


3. Get all available resources from the REST API
------------------------------------------------

* `GET /rest`

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

Possible optional properties for this resource are `feeds`, `debug`, `bots`, 
`profile`, `authorizations`, `access_token`, `register`, `pages`, and `auth`.

These properties are included only if your access token or authorized session 
has correct priviledges. Some resources are public.

******************************************************************************

### 3.1. Pages

******************************************************************************

#### 3.1.1. Listing pages

* `GET /rest/pages`

Get a list of page objects.

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

******************************************************************************


##### 3.1.1.1. Get page resource

* `GET /rest/pages/:name`

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
   "$ref" : "http://reader.tidhr.com/rest/pages/about"
}
```

******************************************************************************


##### 3.1.1.2. Updates the page content

* `POST /rest/pages/:name`
* Requires `edit_pages` priviledge.

Example input body (with Content-Type header as `application/json`):

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
}    
```

******************************************************************************


##### 3.1.1.3. Delete the page resource

* DELETE /rest/pages/:name
* Requires `edit_pages` priviledge.

******************************************************************************


### 3.1.2. Creating a new page

* `POST /rest/pages`
* Requires `edit_pages` priviledge.

Example input body (with `application/json` content type):

```json
{
   "content_type" : "text/x-markdown",
   "content" : "About the reader\n======\n\nThis is our NKO entry -- a RSS/Atom reader.",
   "name" : "about",
   "title" : "About",
}    
```

Pages use [Markdown syntax](http://daringfireball.net/projects/markdown/syntax) 
by default. (Actual library we are using is 
[marked](https://github.com/chjj/marked).)

******************************************************************************


### 3.2. Authorizations and Access Tokens

******************************************************************************


#### 3.2.1. Get list of access tokens

* `GET /rest/authorizations`
* Requires `profile` priviledge.

Example output:
```json
[
   {
      "description" : "Test",
      "token" : "f78678efd12d9d9f3d4bc3f91eca3222",
      "$ref" : "https://reader.tidhr.com/rest/authorizations/f78678efd12d9d9f3d4bc3f91eca3222"
   },
   {
      "description" : "Test 2",
      "token" : "2c3a42b8373e872b66d636dc8ed50eb3",
      "$ref" : "https://reader.tidhr.com/rest/authorizations/2c3a42b8373e872b66d636dc8ed50eb3"
   },
   {
      "description" : "Test3",
      "token" : "66dc251d61d46f4d567784757726f0ca",
      "$ref" : "https://reader.tidhr.com/rest/authorizations/66dc251d61d46f4d567784757726f0ca"
   }
]
```

******************************************************************************


##### 3.2.1.1. Get access token resource

* `GET /rest/authorizations/:access_token`
* Requires `profile` priviledge.

Example response:

```json
{
   "profile" : false,
   "part_feed" : false,
   "edit_profile" : false,
   "import_feed" : false,
   "description" : "Test",
   "bots" : false,
   "users_id" : 13,
   "read_feed" : true,
   "edit_pages" : false,
   "join_feed" : true,
   "debug" : false,
   "token" : "f78678efd12d9d9f3d4bc3f91eca3222",
   "pages" : false
}
```

******************************************************************************


##### 3.2.1.2. Delete access token

* `DELETE /rest/authorizations/:access_token`
* Requires `profile` priviledge.

******************************************************************************


#### 3.2.2. Create a new access token

* `POST /rest/authorizations`

JSON example request body:

```json
{
   "description": "",
   "join_feed": "true",
   "read_feed": "true",
   "part_feed": "true",
   "profile": "true",
   "edit_profile": "false",
}
```

These properties are all optional and will be the same default values as in the 
example.

***Note:*** Because of a bug in our code you cannot change `edit_profile`, and 
we cannot fix our app code during [the Node Knockout 
competition](http://nodeknockout.com).

* Requires `profile` priviledge.

You will get this object as response:

```json
{
   "profile" : true,
   "part_feed" : true,
   "secret" : "gtI0nWrpISr8S2Ma46xMSEP65Xc9irSQ",
   "edit_profile" : false,
   "import_feed" : false,
   "$ref" : "http://reader.tidhr.com/rest/authorizations/554a3adb75c62be589b4620820a40d26",
   "description" : "",
   "bots" : false,
   "users_id" : 123,
   "read_feed" : true,
   "edit_pages" : false,
   "join_feed" : true,
   "debug" : false,
   "token" : "554a3adb75c62be589b4620820a40d26",
   "pages" : false
}
```

******************************************************************************


### 3.3. Returns debug information from the service.

* `GET /rest/debug`
* Requires `debug` priviledge.

You will get this object as response:

```json
{
   "uid" : 1000,
   "groups" : [
      1000
   ],
   "gid" : 1000
}
```

******************************************************************************


### 3.4. User Profile

******************************************************************************

### 3.4.1. Get current profile information

* `GET /rest/profile`
* Requires `profile` priviledge.

You will get this object as response:

```json
{
   "profile" : {
      "provider" : "github",
      "emails" : [
         {
            "value" : "jheusala@example.com"
         }
      ],
      "id" : 123456,
      "profileUrl" : "https://github.com/jheusala",
      "username" : "jheusala",
      "displayName" : "Jaakko-Heikki Heusala"
   },
   "id" : 123,
   "username" : "jhh"
}
```

******************************************************************************


### 3.4.2. Update user profile

* `POST /rest/profile`

Example input body:
```json
{
   "username": "jhh",
   "password": "abcdefgh12345"
}
```

* Property `username` is optional. Username can only be changed if current 
profile does not have a username.
* Property `password is optional. If provided, users' password will be changed.
* Requires `edit_profile` priviledge.

******************************************************************************


### 3.5. Registration

******************************************************************************


### 3.5.1. Registration

* `POST /rest/register`

Example request body:

```json
{
   "username": "john",
   "password": "1234567"
}
```

* Properties `username` and `password` are required and cannot be empty.

******************************************************************************


#### 3.5.2. Registration (with GET)

* `GET /rest/register`

This resource actually does nothing and is only provided as a customary manner.

You will get this object as response:

```json
{}
```

******************************************************************************


### 3.6. Bots

******************************************************************************

#### 3.6.1. Get list of active bots

* `GET /rest/bots`
* Requires `bots` priviledge.

You will get this object as response:

```json
```


******************************************************************************


#### 3.6.2. When a bot wants to register on the server and gets an ID

* `POST /rest/bots`
* Requires `bots` priviledge.

You will get this object as response:

```json
```

******************************************************************************


### 3.6.3. 

* `DELETE /rest/bots/:bot_id`
* Requires `bots` priviledge.

You will get this object as response:

```json
```

******************************************************************************


### 3.17. GET /rest/bots/:bot_id

* Requires `bots` priviledge.

You will get this object as response:

```json
```

******************************************************************************


### 3.18. GET /rest/bots/:bot_id/feeds

You will get this object as response:

```json
```

* Requires `bots` priviledge.

******************************************************************************


### 3.19. POST /rest/feeds

You will get this object as response:

```json
```

* Requires `join_feed` priviledge.

******************************************************************************


### 3.20. DELETE /rest/feeds/:feed_id

You will get this object as response:

```json
```

* Requires `part_feed` priviledge.

******************************************************************************


### 3.21. GET /rest/feeds

You will get this object as response:

```json
```

* Requires `read_feed` priviledge.

******************************************************************************


### 3.22. GET /rest/feeds/:feed_id

You will get this object as response:

```json
```

* Requires `read_feed` priviledge.

******************************************************************************


### 3.23. GET /rest/feeds/:feed_id/items

You will get this object as response:

```json
```

* Requires `read_feed` priviledge.

******************************************************************************


### 3.24. POST /rest/feeds/:feed_id

You will get this object as response:

```json
```

* Requires `import_feed` priviledge.

******************************************************************************


### 3.25. POST /rest/feeds/:feed_id/items

You will get this object as response:

```json
```

* Requires `import_feed` priviledge.

******************************************************************************


### 3.26. GET /rest/feeds/:feed_id/items/:feed_item_id

You will get this object as response:

```json
```

* Requires `read_feed` priviledge.

******************************************************************************


4. GET /auth
------------

Some passport related APIs are located at [https://reader.tidhr.com/auth/](reader.tidhr.com/auth/).

You will get this object as response:

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

******************************************************************************


A. Appendix
--------

******************************************************************************


### A1. How to use CURL

Save settings to `.netrc` and use `curl -n [-X method] URL`.

******************************************************************************

