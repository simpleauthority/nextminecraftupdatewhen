#!/usr/bin/env node

// import deps
import app from '../app'
import debugLib from 'debug'
import http from 'http'
import config from '../config'

const port = config.port;
app.set('port', port);

const debug = debugLib('nextminecraftupdatewhen:server')

/**
 * Event listener for HTTP server "error" event
 * @param {Error} error 
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

