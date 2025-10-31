const { createClient } = require('redis')
const client = createClient()

client.on('error', (err) => console.error('Redis error:', err))

async function initRedis() {
  if (!client.isOpen) {
    await client.connect()
  }
}

async function cacheMiddleware(req, res, next) {
  await initRedis()
  const key = req.originalUrl
  const cached = await client.get(key)

  if (cached) {
    return res.send(JSON.parse(cached))
  }

  const sendResponse = res.send.bind(res)
  res.send = (body) => {
    client.setEx(key, 3600, JSON.stringify(body))
    sendResponse(body)
  }

  next()
}

module.exports = cacheMiddleware
