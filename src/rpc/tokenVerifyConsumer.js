const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Adjust path if needed

async function startTokenVerifyConsumer() {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue('verify.token.request');

  channel.consume('verify.token.request', async (msg) => {
    const { token } = JSON.parse(msg.content.toString());
    let response;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Fetch full user details from DB
      const user = await UserModel.findById(decoded.id).select('-password');

      if (!user) {
        response = { valid: false, error: 'User not found' };
      } else {
        response = { valid: true, payload: user }; // ✅ Send full user data
      }
    } catch (err) {
      response = { valid: false, error: err.message };
    }

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(response)),
      { correlationId: msg.properties.correlationId }
    );

    channel.ack(msg);
  });

  
}

module.exports = startTokenVerifyConsumer;
