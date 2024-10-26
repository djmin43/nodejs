import {Hono} from 'hono'
import {serveStatic} from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({root: './'}))

app.get('/' , serveStatic({path: './static/index.html'}))

console.log('srver running')

export default app
