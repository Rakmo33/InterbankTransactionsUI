import React, { useState } from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import data from '../database/data.json';
import './AtmForm.scss';

function AtmForm(props) {
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleAutofill1 = () => {
    setAmount('50');
    setCardNumber('1001');
    setPin('1234');
  };

  const handleAutofill2 = () => {
    setAmount('50');
    setCardNumber('2001');
    setPin('4567');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //search the user in database based on the card number
    const user = data.users.find((user) => {
      return user.cardNumber === cardNumber;
    });

    if (!user) {
      //user not found in db
      alert('User not found!');
      return;
    }

    //check if pin is valid
    if (pin !== user.pin) {
      alert('Invalid credentials');
      return;
    }

    //check if balance is sufficient
    if (amount > user.balance) {
      alert('Insufficient balance!');
      return;
    }

    //check if amount is positive
    if (amount <= 0) {
      alert('Invalid amount!');
      return;
    }

    //set transaction status randomly
    const randomBoolean = Math.random() < 0.8;
    const TransactionStatus = randomBoolean ? 'SUCCESS' : 'FAILURE';

    //set port for API endpoints based on the ATM bank
    let port = '';
    switch (props.bankName) {
      case 'BankA':
        port = '8081';
        break;
      case 'BankB':
        port = '8082';
        break;

      default:
        break;
    }

    //make API request to store the transaction
    axios
      .post(`http://localhost:${port}/api/transactions/`, {
        from: user.bankName,
        to: props.bankName,
        amount: amount,
        status: TransactionStatus,
      })
      .then((res) => {
        console.log(res.data);
        setAmount('');
        setPin('');
        setCardNumber('');
        setStatus(TransactionStatus);
        setTransactionId(res.data.id);
        setShowAlert(true);
      });
  };

  return (
    <div className="container">
      <div id="result">
        {showAlert ? (
          <Alert
            severity={status === 'SUCCESS' ? 'success' : 'error'}
            onClose={() => {
              setShowAlert(false);
            }}
          >
            <AlertTitle>
              Transaction {status === 'SUCCESS' ? 'Successful' : 'Failed'}!
            </AlertTitle>
            <br></br>
            Your Transaction ID is:
            <div id="transacId">{transactionId}</div>
          </Alert>
        ) : null}
      </div>
      <h2 className="title">Welcome to {props.bankName} ATM! </h2>
      <form onSubmit={handleSubmit}>
        <TextField
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          label="Card Number"
          id="outlined-size-small"
          size="small"
          margin="normal"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <TextField
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]{4}' }}
          label="Pin"
          id="outlined-size-small"
          size="small"
          margin="normal"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <TextField
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          label="Amount"
          id="outlined-size-small"
          size="small"
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button style={{ margin: '20px 0' }} type="submit" variant="contained">
          Submit
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            style={{ margin: '5px auto', textTransform: 'none' }}
            onClick={() => {
              handleAutofill1();
            }}
            size="small"
            variant="outlined"
          >
            Autofill BankA user details
          </Button>
          <Button
            style={{ margin: '5px auto', textTransform: 'none' }}
            onClick={() => {
              handleAutofill2();
            }}
            size="small"
            variant="outlined"
          >
            Autofill BankB user details
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AtmForm;
