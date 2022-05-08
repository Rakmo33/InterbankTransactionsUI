import React from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';

import AtmForm from './AtmForm';
import BankForm from './BankForm';
import './Navbar.scss';

export default function Home() {
  const [value, setValue] = React.useState('/atm1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BrowserRouter>
      <div>
        <div className="navbar">
          <Container maxWidth="lg" className="navbar">
            <h2>Interbank Transactions</h2>
            <Box className="nav">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
              >
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  label="BankA ATM"
                  value="/atm1"
                  to="/atm1"
                />
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  label="BankB ATM"
                  value="/atm2"
                  to="/atm2"
                />
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  label="BankA Dashboard"
                  value="/bank1"
                  to="/bank1"
                />
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  label="BankB Dashboard"
                  value="/bank2"
                  to="/bank2"
                />
              </Tabs>
            </Box>
          </Container>
        </div>

        <Routes>
          <Route path="/atm1" element={<AtmForm bankName={'BankA'} />}></Route>
          <Route path="/atm2" element={<AtmForm bankName={'BankB'} />}></Route>
          <Route
            path="/bank1"
            element={<BankForm bankName={'BankA'} />}
          ></Route>
          <Route
            path="/bank2"
            element={<BankForm bankName={'BankB'} />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
