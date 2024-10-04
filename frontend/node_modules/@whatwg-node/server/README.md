# WHATWG Node Generic Server Adapter

`@whatwg-node/server` helps you to create a generic server implementation by using WHATWG Fetch API
for Node.js, AWS Lambda, Cloudflare Workers, Deno, Express, Fastify, Koa, Next.js and Sveltekit.

Once you create an adapter with `createServerAdapter`, you don't need to install any other platform
specific package since the generic adapter will handle it automatically.

## How to start

Let's create a basic Hello World server adapter.

```ts
// myServerAdapter.ts
import { createServerAdapter } from '@whatwg-node/server'

export default createServerAdapter((request: Request) => {
  return new Response(`Hello World!`, { status: 200 })
})
```

## Integrations

You can use your server adapter with the following integrations:

### Node.js

[Node.js](https://nodejs.org/api/http.html) is the most popular server side JavaScript runtime.

```ts
import { createServer } from 'http'
import myServerAdapter from './myServerAdapter'

// You can create your Node server instance by using our adapter
const nodeServer = createServer(myServerAdapter)
// Then start listening on some port
nodeServer.listen(4000)
```

### AWS Lambda

AWS Lambda is a serverless computing platform that makes it easy to build applications that run on
the AWS cloud. Our adaoter is platform agnostic so they can fit together easily. In order to reduce
the boilerplate we prefer to use
[Serverless Express from Vendia](https://github.com/vendia/serverless-express).

```ts
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import type { Handler } from '@aws-cdk/aws-lambda'
import myServerAdapter from './myServerAdapter'

interface ServerContext {
  event: APIGatewayEvent
  lambdaContext: Context
}

export async function handler(
  event: APIGatewayEvent,
  lambdaContext: Context
): Promise<APIGatewayProxyResult> {
  const url = new URL(event.path, 'http://localhost')
  if (event.queryStringParameters != null) {
    for (const name in event.queryStringParameters) {
      const value = event.queryStringParameters[name]
      if (value != null) {
        url.searchParams.set(name, value)
      }
    }
  }

  const response = await myServerAdapter.fetch(
    url,
    {
      // For v1.0 you should use event.httpMethod
      method: event.requestContext.http.method,
      headers: event.headers as HeadersInit,
      body: event.body
        ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
        : undefined
    },
    {
      event,
      lambdaContext
    }
  )

  const responseHeaders: Record<string, string> = {}

  response.headers.forEach((value, name) => {
    responseHeaders[name] = value
  })

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: await response.text(),
    isBase64Encoded: false
  }
}
```

### Cloudflare Workers

Cloudflare Workers provides a serverless execution environment that allows you to create entirely
new applications or augment existing ones without configuring or maintaining infrastructure. It uses
Fetch API already so we can use our adapter as an event listener like below;

```ts
import myServerAdapter from './myServerAdapter'

self.addEventListener('fetch', myServerAdapter)
```

### Deno

[Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust](https://deno.land/).
You can use our adapter as a Deno request handler like below;

```ts
import myServerAdapter from './myServerAdapter.ts'

Deno.serve(myServerAdapter)
```

### Express

[Express is the most popular web framework for Node.js.](https://expressjs.com/) It is a minimalist
framework that provides a robust set of features to handle HTTP on Node.js applications.

You can easily integrate your adapter into your Express application with a few lines of code.

```ts
import express from 'express'
import myServerAdapter from './myServerAdapter'

const app = express()

// Bind our adapter to `/mypath` endpoint
app.use('/mypath', myServerAdapter)

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000/mypath')
})
```

### Fastify

[Fastify is one of the popular HTTP server frameworks for Node.js.](https://www.fastify.io/). You
can use your adapter easily with Fastify.

So you can benefit from the powerful plugins of Fastify ecosystem.
[See the ecosystem](https://www.fastify.io/docs/latest/Guides/Ecosystem/)

```ts
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import myServerAdapter from './myServerAdapter'

// This is the fastify instance you have created
const app = fastify({ logger: true })

/**
 * We pass the incoming HTTP request to our adapter
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  url: '/mypath',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response = await myServerAdapter.handleNodeRequestAndResponse(req, reply, {
      req,
      reply
    })
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    // Fastify doesn't accept `null` as a response body
    reply.send(response.body || undefined)

    return reply
  }
})

app.listen(4000)
```

### Koa

[Koa is another Node.js server framework designed by the team behind Express, which aims to be a smaller, more expressive.](https://koajs.com/)
You can add your adapter to your Koa application with a few lines of code then
[benefit middlewares written for Koa.](https://github.com/koajs/koa/wiki)

```ts
import Koa from 'koa'
import myServerAdapter from './myServerAdapter'

const app = new Koa()

app.use(async ctx => {
  const response = await myServerAdapter.handleNodeRequest(ctx.req)

  // Set status code
  ctx.status = response.status

  // Set headers
  response.headers.forEach((value, key) => {
    ctx.append(key, value)
  })

  ctx.body = response.body
})

app.listen(4000, () => {
  console.log('Running the server at http://localhost:4000')
})
```

### Next.js

[Next.js](https://nextjs.org/) is a web framework that allows you to build websites very quickly and
our new server adapter can be integrated with Next.js easily as an API Route.

```ts
// pages/api/myEndpoint.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import myServerAdapter from './myServerAdapter'

export const config = {
  api: {
    // Disable body parsing if you expect a request other than JSON
    bodyParser: false
  }
}

export default myServerAdapter
```

### SvelteKit

[SvelteKit](https://kit.svelte.dev/) is the fastest way to build svelte apps. It is very simple, and
let you build frontend & backend in a single place

```ts
import myServerAdapter from './myServerAdapter'

export { myServerAdapter as get, myServerAdapter as post }
```

### Bun

[Bun](https://bun.sh/) is a modern JavaScript runtime like Node or Deno, and it supports Fetch API
as a first class citizen. So the configuration is really simple like any other JS runtime;

```ts
import myServerAdapter from './myServerAdapter'

Bun.serve(myServerAdapter)

const server = Bun.serve(yoga)

console.info(`Server is running on ${server.hostname}`)
```

## File Uploads / Multipart Requests

Multipart requests are a type of HTTP request that allows you to send blobs together with regular
text data which has a mime-type `multipart/form-data`.

For example, if you send a multipart request from a browser with `FormData`, you can get the same
`FormData` object in your request handler.

```ts
import { createServerAdapter } from '@whatwg-node/server'

const myServerAdapter = createServerAdapter(async request => {
  // Parse the request as `FormData`
  const formData = await request.formData()
  // Select the file
  const file = formData.get('file')
  // Process it as a string
  const fileTextContent = await file.text()
  // Select the other text parameter
  const regularTextData = formData.get('additionalStuff')
  // ...
  return Response.json({ message: 'ok' })
})
```

You can learn more about [File API](https://developer.mozilla.org/en-US/docs/Web/API/File) on MDN
documentation.

## Routing and Middlewares

We'd recommend to use `fets` to handle routing and middleware approach. It uses
`@whatwg-node/server` under the hood.

> Learn more about `fets` [here](https://github.com/ardatan/fets)
