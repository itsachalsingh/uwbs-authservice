const amqp = require('amqplib')

async function publish(queue, message) {
  const conn = await amqp.connect(process.env.RABBIT_URL)
  const ch = await conn.createChannel()
  await ch.assertQueue(queue)
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
  setTimeout(() => conn.close(), 1000)
}

module.exports = publish
