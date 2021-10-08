import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Web3Helper from '../../web3Helpers';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TransferTokenModal = {
  content : <div> 
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
       Transfer
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Enter the amount to transfer
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Button onClick={() => {
            Web3Helper.token.methods.transfer('Me', 100);
          }}>
            xs=8
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => {
            Web3Helper.token.methods.transfer('Me', 100);
          }}>
            xs=4
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => {
            Web3Helper.token.methods.transfer('Me', 100);
          }}>
            xs = 4
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Button onClick={() => {
            Web3Helper.token.methods.transfer('Me', 100);
          }}>
            xs = 8
          </Button>
        </Grid>
      </Grid>
    </Box>
  </div>,
  style
};


const Modals = {
  transfer : TransferTokenModal
}


export default Modals;