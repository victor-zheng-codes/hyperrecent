# Hyper Recent Backend Documentation

This is a complementary file which goes alongside [README-Technical.md](README-Technical.md). This document details the backend (API) of the Hyper Recent application. 

Users are encouraged to use this file alongside [postman.json](docs/postman.json) which can be loaded into [Postman](https://www.postman.com/). 

# Backend API Documentation

## POST /api/articles

The `/api/articles/` endpoint returns a list of articles, along with pagination information. Each article entry includes details such as title, slug, publisher, authors, publication date, summary, publisher icon URL, and categories.

### Base URL

http://localhost:{{PORT}}/api/articles/


Replace `{{PORT}}` with the actual port number the server is running on.

### Request Body

For pagination purposes, the POST endpoint accepts the page and the limit for the request. The page defaults at 1 and the limit is defaulted to 20.

The request body should be a JSON object with the following properties:

- **page**: `integer` (optional)  
  The page number to retrieve. Defaults to `1` if not specified.

- **limit**: `integer` (optional)  
  The number of authors per page. Defaults to `20` if not specified.


### Response Format

The response is a JSON object with the following structure:

```json
{
    "posts": [
        {
            "title": "string",
            "slug": "string",
            "publisher": "string",
            "authors": [
                "string"
            ],
            "date": "string (date)",
            "summary": "string",
            "publisherIconUrl": "string (URL)",
            "categories": [
                "string"
            ]
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (timestamp)"
}
```


## POST /api/articles/[id]

The `/api/articles/{id}` endpoint provides detailed information about a single article, including its authors, institution, publication date, abstract, related topics, and additional metadata.

### Base URL

http://localhost:{{PORT}}/api/articles/{id}

Replace `{{PORT}}` with the actual port number and `{id}` with the article ID you want to retrieve.

### Response Format

The response is a JSON object with the following structure:

```json
{
    "article": {
        "articleId": "integer",
        "title": "string",
        "institution": "string",
        "date": "string (ISO 8601 date)",
        "link": "string (URL)",
        "abstract": "string",
        "isPreprint": "boolean",
        "firstAuthorId": "integer",
        "lastAuthorId": "integer",
        "authorList": "string",
        "slug": "string",
        "server": "string",
        "version": "integer"
    },
    "firstAuthor": {
        "authorId": "integer",
        "firstName": "string",
        "lastName": "string"
    },
    "lastAuthor": {
        "authorId": "integer",
        "firstName": "string",
        "lastName": "string"
    },
    "topics": [
        "string"
    ],
    "now": "integer (timestamp)"
}
```

## GET /api/articles/search

The `/api/articles/search` endpoint allows users to search for articles based on a query string. This endpoint returns a list of articles that match the search criteria, along with pagination information.

### Base URL

http://localhost:{{PORT}}/api/articles/search?q={query}

Replace `{{PORT}}` with the actual port number the server is running on, and `{query}` with the search term you want to use.

### Query Parameters

- **q**: `string`  
  The search query term used to find articles. This term is matched against fields like the article title, abstract, or other relevant metadata.

## Response Format

The response is a JSON object with the following structure:

```json
{
    "posts": [
        {
            "title": "string",
            "slug": "string",
            "publisher": "string",
            "authors": [
                "string"
            ],
            "date": "string (date)",
            "summary": "string",
            "publisherIconUrl": "string (URL)",
            "categories": [
                "string"
            ]
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (timestamp)"
}
```


## POST /api/authors

The `/api/authors` endpoint returns a list of authors who have contributed as either the first author or last author in the dataset, with optional pagination controls to manage large datasets.

#### Base URL

http://localhost:{{PORT}}/api/authors

Replace `{{PORT}}` with the actual port number of the server.

### Request Body

The request body should be a JSON object with the following properties:

- **page**: `integer` (optional)  
  The page number to retrieve. Defaults to `1` if not specified.

- **limit**: `integer` (optional)  
  The number of authors per page. Defaults to `20` if not specified.

### Example Request

```json
{
    "page": 1,
    "limit": 20
}
```

### Response Format
The response is a JSON object with the following structure:


```json
{
    "authors": [
        {
            "authorId": "integer",
            "firstName": "string",
            "lastName": "string",
            "affiliation": "string (optional)"
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (timestamp)"
}
```

## POST /api/authors/[id]

The `/api/authors/{id}` endpoint retrieves information about a specific author and their associated publications.

### Base URL
http://localhost:{{PORT}}/api/authors/{id}


Replace `{{PORT}}` with the actual port number of the server, and `{id}` with the author ID you want to retrieve.

### Request Body

For pagination purposes, the POST endpoint accepts the page and the limit for the request. The page defaults at 1 and the limit is defaulted to 20.

The request body should be a JSON object with the following properties:

- **page**: `integer` (optional)  
  The page number to retrieve. Defaults to `1` if not specified.

- **limit**: `integer` (optional)  
  The number of authors per page. Defaults to `20` if not specified.


### Response Format

The response is a JSON object with the following structure:

```json
{
    "author": {
        "authorId": "integer",
        "firstName": "string",
        "lastName": "string"
    },
    "papers": [
        {
            "articleId": "integer",
            "title": "string",
            "institution": "string",
            "date": "string (ISO 8601 date format)",
            "link": "string (DOI or URL)",
            "abstract": "string",
            "isPreprint": "boolean",
            "firstAuthorId": "integer",
            "lastAuthorId": "integer",
            "authorList": "string",
            "slug": "string",
            "server": "string",
            "version": "integer"
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (timestamp)"
}
```

## POST /api/topics

### Endpoint
**POST** `http://localhost:{{PORT}}/api/topics`

### Description
This endpoint allows you to retrieve a list of topics with pagination support. The request body should include pagination parameters (`limit` and `page`) to define the number of topics per page and the page number. The response will include a paginated list of topics.

### Request Body

The request body should contain the following JSON structure:

```json
{
    "pagination": {
        "limit": "integer", 
        "page": "integer"
    }
}
```

### Response

The response will contain a list of topics and pagination details. The response structure will look like this:


```json
{
    "topics": [
        {
            "topicId": "integer",
            "name": "string"
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (timestamp)"
}
```


## POST /api/topics/[id]

## Endpoint
**POST** `http://localhost:{{PORT}}/api/topics/id`

### Description
This endpoint allows you to get the articles associated with the topic id `{id}`.

### Response Body

The response body should contain the following JSON structure:

```json
{
    "topic": {
        "topicId": "integer", 
        "name": "string"
    },
    "papers": [
        {
            "articleId": "integer",
            "title": "string",
            "institution": "string",
            "date": "string (ISO 8601 date format)",
            "link": "string (DOI or URL)",
            "abstract": "string",
            "isPreprint": "boolean",
            "firstAuthorId": "integer",
            "lastAuthorId": "integer",
            "authorList": "array of strings",
            "slug": "string",
            "server": "string",
            "version": "integer"
        }
    ],
    "pagination": {
        "currentPage": "integer",
        "pageSize": "integer",
        "totalItems": "integer",
        "totalPages": "integer"
    },
    "now": "integer (Unix timestamp)"
}
```
