import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import axios from 'axios';
import './AtmForm.scss';

function BankForm(props) {
  const [transactionId, setTransactionId] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [fromBank, setFromBank] = useState('');
  const [toBank, setToBank] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

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

    //make API request to retrieve the transaction details
    axios
      .get(`http://localhost:${port}/api/transactions/${transactionId}`)
      .then((res) => {
        console.log(res.data);
        setShowAlert(true);
        if (res.data.result.from) {
          setIsValid(true);
          setFromBank(res.data.result.from);
          setToBank(res.data.result.to);
          setAmount(res.data.result.amount);
          setStatus(res.data.result.status);
          setTimeStamp(res.data.result.timestamp);
        } else {
          setIsValid(false);
        }
      });
  };

  return (
    <div>
      <div className="constainer">
        <div id="result">
          {showAlert ? (
            isValid ? (
              <Alert
                severity={'success'}
                onClose={() => {
                  setShowAlert(false);
                }}
              >
                <AlertTitle>Transaction Details are as follows:</AlertTitle>
                <br />
                User's bank: {fromBank}
                <br />
                ATM bank: {toBank}
                <br />
                Amount: {amount}
                <br />
                Transaction Status: {status}
                <br />
                Timestamp: {timeStamp}
              </Alert>
            ) : (
              <Alert
                severity={'error'}
                onClose={() => {
                  setShowAlert(false);
                }}
              >
                <AlertTitle>Transaction not found!</AlertTitle>
              </Alert>
            )
          ) : null}
        </div>
        <h2 className="title">Welcome to {props.bankName} Dashboard! </h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Transaction ID"
            id="outlined-size-small"
            size="small"
            margin="normal"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />

          <Button
            style={{ margin: '20px 0' }}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default BankForm;
