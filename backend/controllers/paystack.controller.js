const crypto = require('crypto');

exports.webhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET || '';
    const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
    const signature = req.headers['x-paystack-signature'];

    if (signature !== hash) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(req.body.toString());
    // TODO: handle events (charge.success, transfer.success, etc.)
    console.log('Paystack webhook event:', event.event);

    // acknowledge
    res.status(200).send('ok');
  } catch (err) {
    console.error('Paystack webhook error', err);
    res.status(500).send('server error');
  }
};
