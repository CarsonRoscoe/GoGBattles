import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Web3Helper from '../../web3Helpers';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            To
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField />
        </Grid>
        <Grid item xs={3}>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Amount
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => {
            Web3Helper.token.methods.transfer('Me', 100);
          }}>
            Submit
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