# Vanilla NodeJS Server
 This is a pure NodeJS server. To demonstrate how to build an server with no external libraries.

## Quick Start

 - `git clone https://github.com/OmarMuhtaseb/Vanilla-NodeJS-Server.git`
 - `npm ci`
 - `npm start`
 - `http://localhost:3000/health-check`

## Overview
The server provides three APIs:
 - Get /health-check -- Server health check
 - Get / -- Change order status to delivered
	 - Authentication needed (requirement)
	 - Response is an order resource
```
{
	"order":  {
		"id":  "string",
		"name":  "string",
		"lat":  "number",
		"lng":  "number",
		"address":  "string",
		"status":  "string"
	}
}
```
 - Get /list  -- List the orders
	 - No authentication needed (requirement)
	 - Supports pagination using `limit` and `skip` as query parameters.
		 - skip: number of records to be skipped, default = 0.
		 - limit: number of records to be returned, default = 10.
	 - Supports status filtering by sending `delivered:boolean` as a query parameters.
		 - On sending nothing, it will be considered as `false`, and all the statuses except for `delivered` will be returned.
		 - On sending `true`, only the orders with `delivered` status will be returned.
 ```
{
	"orders":  [{
		"id":  "string",
		"name":  "string",
		"lat":  "number",
		"lng":  "number",
		"address":  "string",
		"status":  "string"
	}]
}
```
 - Any other path will result with 
 ```
 {
	"error":  {
		"code":  404,
		"message":  "Path not found",
		"path":  "/undefined-url"
	}
}
```

For simplicity, I'm going to consider the data as a table of orders.

## What has been done:
 - Creating new server with no external libs, like Express. The only used libs where provided by NodeJS.
 - Creating a new middleware manager in order to be easily able to add different middlewares to the system.
 - Middleware can be easily attached to the routes, by adding the middleware function to the array of any specific route.
 - Creating an authentication middleware to check for the authentication key. As for the authentication itself, a header should be sent with the following `calu-key:secret-key`.
 - Creating an exception handling middleware in order to wrap all the exceptions in a specific format. This middleware is applied to all routes. Any exception happens, whether handled or not, will result in the following structure
```
 {
	 "error": {
		"code":  "number",
		"message":  "string",
		"path":  "string"
	}
}
```
 - Creating a logging middleware to log all the request that the server receives. This middleware is applied to all routes.
 - Files as a database
	 - As for the database, since we are dealing with files, I had to create a whole DAL to deal with it. This layer exposes an interface with the required functions. This interface should be implemented by any other database provider in order to be integrated with the system.
	 - On starting the application, the data will be loaded to the memory to provide fast and efficient performance.
	 - On loading the data, in case the file does not exist, it will not be created till the first write to the file. ( This is a requirement from the task).
	 - Since we are dealing with files, every write operation is a blocking operation to the whole file. It is not allowed to write on the same file by two different operations on the same time.
	 - The layer uses generic types in order to provide type checks.
	 - If we want to change the database, the new database should implement the `BaseRepository` interface and override its methods.
 - Events
	 - In order to subscribe to order status changes as a listener. I created a class that extends `events` module from NodeJS. Also, I used an external lib to help with the types for the extension.
	 - The events that can be subscribed to are defined in an `Enum`.
	 - We can easily subscribe to existing events by this line of code `orderEventEmitter.on(eventType, callback)`.
	 - In order to subscribe to new events, we need to add the new event to the events enum first. Then, we need to define a listener to that event, just as the previous step. Finally, we need to emit that new event in the code. 
 - Stats
	 - In order to store the count of delivered orders, I needed to create another table, or file in this case. Since, I only work with resources, and stats is just another resource such as orders.
	 - The table ideally consists of one record, that record holds the total number of delivered orders, since the app starting date.
	 - There are no direct API to deal with this resource. (Not a requirement).

## Time Report:
Total is around 9-11 hrs. I didn't time exactly every part. Also, the were some overlapping between them. But this is an approximate estimations for the tasks.
 - 1 hours to set up the project, the typing, the get the server up.
 - 2-3 to set up the middleware manager and the middlewares.
 - 2-3 hours to create DAL layer.
 - 2-3 hours to set up the events.
 - 1 hours to write the documentation.
