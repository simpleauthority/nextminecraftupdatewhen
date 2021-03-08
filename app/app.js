import express from 'express'
import combynExpress from 'combynexpress'
import nocache from 'nocache'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import logger from 'morgan'

import homeRouter from './router/home'
import versionsRouter from './router/versions'

const app = express()

app.disable('view cache')

app.engine('combyne', combynExpress())

app.set('views', './app/views')
app.set('view engine', 'combyne')

app.use(nocache())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cookieParser())

app.use(homeRouter())
app.use(versionsRouter())

app.use(function(req, res, next) {
  next(createError(404))
});

app.use(function(err, req, res, next) {
  const status = err.status || 500
  const error = req.app.get('env') === 'development' ? err : undefined

  let json = { status }
  if (error) {
    json = {
      ...json,
      error: error.message
    }
  }

  res.status(status)
  res.json(json)
});

export default app
