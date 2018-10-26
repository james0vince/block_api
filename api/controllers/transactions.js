const mongoose = require('mongoose');
const Transactions = require('../models/transactions');

exports.transactions_get_all = (req, res) => {
  Transactions.find({ $or: [
    { user_id: req.userData.userId },
    { recipient_id: req.userData.userId }] })
  .exec()
  .then(transactions => {
    res.status(200).json({
      count: transactions.length,
      transactions: transactions.map(transaction => {
        return {
          _id: transaction._id,
          user_id: transaction.user_id,
          recipient_id: transaction.recipient_id,
          created_at: transaction.created_at,
          amount_fiat: transaction.amount_fiat,
          amount_vox: transaction.amount_vox,
          description: transaction.description,
          currency: transaction.currency,
          request: {
            type: 'GET',
            url: `http://localhost:3000/transactions/${transaction._id}`
          }
        };
      })
    });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
};

exports.transactions_get_one = (req, res) => {
  Transactions.findById(req.params.id)
  .select('_id user_id recipient_id created_at amount_fiat amount_vox description currency')
  .populate('user_id', 'profile.first_name profile.last_name')
  // .populate('recipient_id', 'profile.first_name profile.last_name')
  .exec()
  .then(transaction => {
    if (transaction) {
      const connectedUserId = JSON.stringify(req.userData.userId);
      const transactionUserId = JSON.stringify(transaction.user_id._id);
      const transactionRecipientId = JSON.stringify(transaction.recipient_id._id);

      if (transactionUserId === connectedUserId || transactionRecipientId === connectedUserId) {
        res.status(200).json({
          transaction,
          request: {
            type: 'GET',
            description: 'GET_ALL_TRANSACTIONS',
            url: 'http://localhost:3000/transactions/'
          }
        });
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    }

    return res.status(404).json({ message: 'Transaction not found' });
  })
  .catch(err => {
    return res.status(500).json({ error: err });
  });
};

exports.transactions_create_transaction = (req, res) => {
  const transaction = new Transactions({
      _id: mongoose.Types.ObjectId(),
      user_id: req.userData.userId,
      recipient_id: req.body.recipient_id,
      created_at: new Date().getTime(),
      amount_fiat: req.body.amount_fiat,
      amount_vox: req.body.amount_vox,
      description: req.body.description,
      currency: req.body.currency
    });

    transaction.save()
    .then(result => {
      return res.status(200).json({
        _id: result._id,
        user_id: result.user_id,
        recipient_id: result.recipient_id,
        created_at: result.created_at,
        amount_fiat: result.amount_fiat,
        amount_vox: result.amount_vox,
        description: result.description,
        currency: result.currency,
        request: {
          type: 'GET',
          url: `http://localhost:3000/transactions/${transaction._id}`
        }
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};
