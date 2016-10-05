const posts = require('./posts');
const Router = Java.type('io.vertx.ext.web.Router');
const StaticHandler = Java.type('io.vertx.ext.web.handler.StaticHandler');

import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from './components/routes';

const app = Router.router(vertx);

app.get('/api/post').handler((ctx) => {
  ctx.response()
    .putHeader("content-type", "application/json")
    .end(JSON.stringify(posts));
});

app.get('/api/post/:id').handler((ctx) => {
  const id = ctx.request().getParam('id');

  const post = posts.filter(p => p.id == id);

  if (post) {
    ctx.response()
      .putHeader("content-type", "application/json")
      .end(JSON.stringify(post[0]));
  } else {
    ctx.fail(404);
  }

});

app.get().handler((ctx) => {
  match({routes: routes, location: ctx.request().uri()}, (err, redirect, props) => {

    if (err) {
      ctx.fail(err.message);
    } else if (redirect) {
      ctx.response()
        .putHeader("Location", redirect)
        .setStatusCode(302)
        .end();
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      const routerContextWithData = (
        <RouterContext
          {...props}
          createElement={(Component, props) => {
            return <Component posts={posts} {...props} />
          }}
        />
      );
      const appHtml = renderToString(routerContextWithData);

      ctx.response()
        .putHeader("content-type", "text/html")
        .end(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Universal Blog</title>
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script src="/bundle.js"></script>
  </body>
  </html>`);
    } else {
      ctx.next();
    }
  });
});

app.get().handler(StaticHandler.create());

vertx.createHttpServer().requestHandler(function (req) {
  app.accept(req);
}).listen(8080);
