**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [About the REST API](#about-the-rest-api)
	- [1. Access Tokens](#1-access-tokens)
	- [2. Resources](#2-resources)
		- [2.1. Internal Database Schema](#21-internal-database-schema)
	- [3. Get all available resources from the REST API](#3-get-all-available-resources-from-the-rest-api)
		- [3.1. Pages](#31-pages)
			- [3.1.1. Listing pages](#311-listing-pages)
				- [3.1.1.1. Get page resource](#3111-get-page-resource)
				- [3.1.1.2. Updates the page content](#3112-updates-the-page-content)
				- [3.1.1.3. Delete the page resource](#3113-delete-the-page-resource)
			- [3.1.2. Creating a new page](#312-creating-a-new-page)
		- [3.2. Authorizations and Access Tokens](#32-authorizations-and-access-tokens)
			- [3.2.1. Get list of access tokens](#321-get-list-of-access-tokens)
				- [3.2.1.1. Get access token resource](#3211-get-access-token-resource)
				- [3.2.1.2. Delete access token](#3212-delete-access-token)
			- [3.2.2. Create a new access token](#322-create-a-new-access-token)
		- [3.3. Returns debug information from the service.](#33-returns-debug-information-from-the-service)
		- [3.4. User Profile](#34-user-profile)
			- [3.4.1. Get current profile information](#341-get-current-profile-information)
			- [3.4.2. Update user profile](#342-update-user-profile)
		- [3.5. Registration](#35-registration)
			- [3.5.1. Registration](#351-registration)
			- [3.5.2. Registration (with GET)](#352-registration-with-get)
		- [3.6. Bots](#36-bots)
			- [3.6.1. Get list of active bots](#361-get-list-of-active-bots)
			- [3.6.2. When a bot wants to register on the server and get an ID](#362-when-a-bot-wants-to-register-on-the-server-and-get-an-id)
			- [3.6.3. When a bot wants to unregister from the server](#363-when-a-bot-wants-to-unregister-from-the-server)
			- [3.6.4. Get bots own resource](#364-get-bots-own-resource)
				- [3.6.5.1. Get feeds for specific bot](#3651-get-feeds-for-specific-bot)
		- [3.7. Feeds](#37-feeds)
			- [3.7.1. Get all feeds available for this session](#371-get-all-feeds-available-for-this-session)
			- [3.7.2. Subscribe to a new feed](#372-subscribe-to-a-new-feed)
			- [3.7.3 Unsubscribe from specific feed](#373-unsubscribe-from-specific-feed)
			- [3.7.4. Get specific feed object](#374-get-specific-feed-object)
			- [3.7.5. Get specific feed items](#375-get-specific-feed-items)
			- [3.7.6. Edit feed meta data](#376-edit-feed-meta-data)
			- [3.7.7. Send new items to feed](#377-send-new-items-to-feed)
			- [3.7.8. Get single feed item](#378-get-single-feed-item)
		- [4.1. Login by local authentication](#41-login-by-local-authentication)
		- [4.2. Logout](#42-logout)
		- [A1. How to use CURL](#a1-how-to-use-curl)
	- [4. GET /auth](#4-get-auth)
	- [A. Appendix](#a-appendix)

About the REST API
==================

Our [reader.tidhr.com](https://reader.tidhr.com) has also a REST API with 
support for external 3rd party apps. This document describes this API.

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

### 2.1. Internal Database Schema

We use [PostgreSQL 9.3](http://www.postgresql.org/docs/9.3/static/release-9-3.html) with new JSON support.

Here is our database schema:

![Database Schema](http://www.tidhr.com/reader/db-schema.png)

Most of our API objects use same names.

***Note:*** All passwords and access token secrets are hashed with PostgreSQL 
`crypt()`. That's why these values cannot be fetched from the API again.

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
has correct privileges. Some resources are public.

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
* Requires `edit_pages` privilege.

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
* Requires `edit_pages` privilege.

******************************************************************************


#### 3.1.2. Creating a new page

* `POST /rest/pages`
* Requires `edit_pages` privilege.

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
* Requires `profile` privilege.

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
* Requires `profile` privilege.

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
* Requires `profile` privilege.

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

* Requires `profile` privilege.

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
* Requires `debug` privilege.

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

#### 3.4.1. Get current profile information

* `GET /rest/profile`
* Requires `profile` privilege.

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


#### 3.4.2. Update user profile

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
* Requires `edit_profile` privilege.

******************************************************************************


### 3.5. Registration

******************************************************************************


#### 3.5.1. Registration

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
* Requires `bots` privilege.

You will get this object as response:

```json
[
   {
      "last_active" : "2013-11-11T08:03:58.087Z",
      "id" : 6,
      "$ref" : "http://reader.tidhr.com/rest/bots/6"
   },
   {
      "last_active" : "2013-11-11T08:04:00.735Z",
      "id" : 7,
      "$ref" : "http://reader.tidhr.com/rest/bots/7"
   },
   {
      "last_active" : "2013-11-11T08:04:01.941Z",
      "id" : 8,
      "$ref" : "http://reader.tidhr.com/rest/bots/8"
   },
   {
      "last_active" : "2013-11-11T08:04:02.472Z",
      "id" : 9,
      "$ref" : "http://reader.tidhr.com/rest/bots/9"
   },
   {
      "last_active" : "2013-11-11T08:04:03.537Z",
      "id" : 10,
      "$ref" : "http://reader.tidhr.com/rest/bots/10"
   },
   {
      "last_active" : "2013-11-11T08:04:11.747Z",
      "id" : 11,
      "$ref" : "http://reader.tidhr.com/rest/bots/11"
   }
]
```


******************************************************************************


#### 3.6.2. When a bot wants to register on the server and get an ID

* `POST /rest/bots`
* Requires `bots` privilege.

You will get this object as response:

```json
```

******************************************************************************


#### 3.6.3. When a bot wants to unregister from the server

* `DELETE /rest/bots/:bot_id`
* Requires `bots` privilege.

You will get this object as response:

```json
```

******************************************************************************


#### 3.6.4. Get bots own resource

* `GET /rest/bots/:bot_id`
* Requires `bots` privilege.

You will get this object as response:

```json
{
   "feeds" : {
      "$ref" : "http://reader.tidhr.com/rest/bots/11/feeds"
   }
}
```

******************************************************************************


##### 3.6.5.1. Get feeds for specific bot

* `GET /rest/bots/:bot_id/feeds`
* Requires `bots` privilege.

You will get this object as response:

```json
[
   {
      "fetchtime" : "2013-11-11T13:48:51.704Z",
      "$ref" : 
"http://reader.tidhr.com/rest/feeds/c5108ac84f5098aad2b35e3e4f398f92a0154d98"
   }
]
```

******************************************************************************


### 3.7. Feeds

******************************************************************************


#### 3.7.1. Get all feeds available for this session

* `GET /rest/feeds`
* Requires `read_feed` privilege.

You will get this object as response:

```json
[
   {
      "title" : "Uutiset - HS.fi",
      "$ref" : "http://reader.tidhr.com/rest/feeds/8b60e02efd93face9edd246f6763bf5a0cf5211a"
   },
   {
      "title" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
      "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197"
   },
   {
      "title" : "EPisodeWorld RSS feed: All Shows",
      "$ref" : "http://reader.tidhr.com/rest/feeds/5db57a6dfd42b9cc99c0912e9308b8a0847ce459"
   },
   {
      "title" : "RT - Daily news",
      "$ref" : "http://reader.tidhr.com/rest/feeds/f727d4e7e321e0dfe50c1ce0b866147b453f069d"
   }
]
```

******************************************************************************


#### 3.7.2. Subscribe to a new feed

* `POST /rest/feeds`
* Requires `join_feed` privilege.

Example request body:

```json
{
   "feedurl": "http://rss.cnn.com/rss/edition.rss"
}
```

******************************************************************************


#### 3.7.3 Unsubscribe from specific feed

* `DELETE /rest/feeds/:feed_id`
* Requires `part_feed` privilege.


******************************************************************************


#### 3.7.4. Get specific feed object

* `GET /rest/feeds/:feed_id`
* Requires `read_feed` privilege.

You will get this object as response:

```json
{
   "id" : "884b15d1eb470eea8b8115298fbc89c2e02db197",
   "feedurl" : "http://yle.fi/uutiset/rss/uutiset.rss?osasto=oulu",
   "title" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
   "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197",
   "meta" : {
      "pubdate" : null,
      "date" : null,
      "rss:category" : {
         "#" : "Tuoreimmat uutiset",
         "@" : {}
      },
      "copyright" : null,
      "author" : null,
      "generator" : null,
      "cloud" : {},
      "rss:title" : {
         "#" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
         "@" : {}
      },
      "rss:@" : {},
      "@" : [
         {
            "xmlns:content" : "http://purl.org/rss/1.0/modules/content/"
         }
      ],
      "link" : "http://yle.fi/uutiset/",
      "#version" : "2.0",
      "rss:link" : {
         "#" : "http://yle.fi/uutiset/",
         "@" : {}
      },
      "#xml" : {
         "version" : "1.0",
         "encoding" : "UTF-8"
      },
      "language" : null,
      "favicon" : null,
      "categories" : [
         "Tuoreimmat uutiset"
      ],
      "description" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
      "image" : {},
      "rss:description" : {
         "#" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
         "@" : {}
      },
      "#ns" : [
         {
            "xmlns:content" : "http://purl.org/rss/1.0/modules/content/"
         }
      ],
      "xmlUrl" : null,
      "title" : "Yle Uutiset | Oulu | Tuoreimmat uutiset",
      "#type" : "rss",
      "pubDate" : null,
      "xmlurl" : null
   },
   "items" : {
      "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197/items"
   }
}
```

******************************************************************************


#### 3.7.5. Get specific feed items

* `GET /rest/feeds/:feed_id/items`
* Requires `read_feed` privilege.

You will get this object as response:

```json
[
   {
      "summary" : "Nenäpäivän juhlijat valtasivat perjantaina Oulun kävelykatu Rotuaarin. Katso kuvia Nenäpäivän vietosta.",
      "read" : false,
      "title" : "Oulun Rotuaari muuttui punanenäisten kaduksi",
      "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197/items/7cfcce756090b565fdc5b9132b0ea9a6be4f0290"
   },
   {
      "summary" : "Kolea sääkään ei saanut hyväntekijöitä hyytymään. Oulussa järjestetyissä tapahtumissa kerättiin yhteensä 5555 euroa.",
      "read" : false,
      "title" : "Nenäpäivä keräsi Oulussa ennätyssumman",
      "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197/items/99890e9c2beb41e359d635421242e415eb51cad0"
   },
   {
      "summary" : "Alun perin omistajien piti päättää jatkostaan lokakuun loppuun mennessä, mutta heille annettiin viikon verran lisäaikaa.",
      "read" : false,
      "title" : "Fennovoiman omistajien kerrottava jatkostaan tänään",
      "$ref" : "http://reader.tidhr.com/rest/feeds/884b15d1eb470eea8b8115298fbc89c2e02db197/items/3a4eabf78592d969a1115ac5b3c8116a3175a17b"
   }
]
 
```

******************************************************************************


#### 3.7.6. Edit feed meta data

* `POST /rest/feeds/:feed_id`
* Requires `import_feed` privilege.

Example request body:

```json
{
   "title": "New title",
   "meta": {
      ...
   }
}
```


******************************************************************************


#### 3.7.7. Send new items to feed

* `POST /rest/feeds/:feed_id/items`
* Requires `import_feed` privilege.

Example request body:

```json
{
   "title": "Title",
   "description": "Item description",
   "summary": "Item summary",
   "link": "http://example.com/1",
   "origlink": "http://example.com/1",
   "date": "2013-11-08T08:44:23.000Z",
   "pubdate": "2013-11-08T08:44:23.000Z", 
   "author": "",
   "guid": "http://yle.fi/uutiset/6923993",
   "comments": "",
   "images": "",
   "categories": ["One", "Two"],
   "source": "", 
   "enclosures": [
      {
         "length" : null,
         "url" : "http://img.yle.fi/uutiset/oulu/article6923966.ece/ALTERNATES/w205h115/081113+nen%C3%A4p%C3%A4iv%C3%A4+2013+rotuaari+villasukka+pellenen%C3%A4",
         "type" : "image/jpeg"
      }
   ],
   "meta": {
      ...
   }
}
```

You can also send more than one by sending an array instead:

```json
[
  {
     ...
  },
  {
     ...
  }
]
```

******************************************************************************


#### 3.7.8. Get single feed item 

* `GET /rest/feeds/:feed_id/items/:feed_item_id`
* Requires `read_feed` privilege.

You will get this object as response:

```json
{
   "source" : {},
   "pubdate" : "2013-11-08T08:44:23.000Z",
   "feed_id" : "884b15d1eb470eea8b8115298fbc89c2e02db197",
   "date" : "2013-11-08T08:44:23.000Z",
   "author" : null,
   "comments" : null,
   "meta" : null,
   "enclosures" : [
      {
         "length" : null,
         "url" : "http://img.yle.fi/uutiset/oulu/article6923966.ece/ALTERNATES/w205h115/081113+nen%C3%A4p%C3%A4iv%C3%A4+2013+rotuaari+villasukka+pellenen%C3%A4",
         "type" : "image/jpeg"
      }
   ],
   "summary" : "Nenäpäivän juhlijat valtasivat perjantaina Oulun kävelykatu 
Rotuaarin. Katso kuvia Nenäpäivän vietosta.",
   "guid" : "http://yle.fi/uutiset/6923993",
   "id" : "7cfcce756090b565fdc5b9132b0ea9a6be4f0290",
   "link" : "http://yle.fi/uutiset/oulun_rotuaari_muuttui_punanenaisten_kaduksi/6923993?origin=rss",
   "origlink" : null,
   "categories" : [
      "Oulu"
   ],
   "description" : "Nenäpäivän juhlijat valtasivat perjantaina Oulun kävelykatu 
Rotuaarin. Katso kuvia Nenäpäivän vietosta.",
   "image" : null,
   "title" : "Oulun Rotuaari muuttui punanenäisten kaduksi"
}
```

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

If a property...

* `facebook` exists, you can initiate authentication process for Facebook by linking user to resource pointed by `$ref`
* `github` exists, you can initiate authentication process for Github by linking to resource pointed by `$ref`
* `local` exists, you can use local authentication by POSTing to resource pointed by `$ref`
* `logout` exists, it means a session is active and user can logout GETing resource pointed by `$ref`
* `profile` exists, it means a session is active and profile is available in the resource pointed by `$ref`

### 4.1. Login by local authentication

* `POST /auth/local`

Example JSON request body:
```json
{
   "username": "john",
   "password": "12345678"
}
```

This will create a Cookie based session.


### 4.2. Logout

* `GET /auth/logout`

******************************************************************************


A. Appendix
-----------

******************************************************************************


### A1. How to use CURL

Save settings to `.netrc` and use `curl -n [-X method] URL`.

Example `.netrc` file:

```
machine reader.tidhr.com
  login 1u766KPuWTP0fSJJzs62gtAd5YXQpQ4X
  password LAajuGRpbYdaorxgh5u5q3EtaajWowqG
```

******************************************************************************

