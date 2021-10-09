import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Web3Helper from '../../web3Helpers';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export const TransferTokenModalContent = React.forwardRef((props, ref) => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState(0);

    return (
        <div ref={ref} {...props}>
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
                        <TextField value={to} onChange={(e) => setTo(e.target.value)} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Amount
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {
                                console.log(to, amount);
                                let web3 = Web3Helper.getWeb3();
                                if (web3.utils.isAddress(to)) {
                                    let parsed = Number.parseFloat(amount);
                                    if (!Number.isNaN(parsed)) {
                                        Web3Helper.contracts.Token.methods.transfer(to, parsed).send(Web3Helper.getSendOptions());
                                    }
                                    else {
                                        window.alert('Please input a valid amount.');
                                    }
                                }
                                else {
                                    window.alert('Please input a valid address.');
                                }
                            }}
                        >
                            Transfer
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
});

export const TransferCardModalContent = React.forwardRef((props, ref) => {
    const [to, setTo] = useState('');
    const [tokenID, setTokenID] = useState(0);

    return (
        <div ref={ref} {...props}>
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
                        <TextField value={to} onChange={(e) => setTo(e.target.value)} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            TokenID
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={tokenID} onChange={(e) => setTokenID(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {
                                console.log(to, tokenID);
                                let web3 = Web3Helper.getWeb3();
                                if (web3.utils.isAddress(to)) {
                                    let parsed = Number.parseFloat(tokenID);
                                    if (!Number.isNaN(parsed)) {
                                        Web3Helper.contracts.Cards.methods.safeTransferFrom(Web3Helper.getProvider().selectedAddress, to, parsed, 1, "0x0").send(Web3Helper.getSendOptions());
                                    }
                                    else {
                                        window.alert('Please input a valid amount.');
                                    }
                                }
                                else {
                                    window.alert('Please input a valid address.');
                                }
                            }}
                        >
                            Transfer
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
});

export const BurnCardForTokenModalContent = React.forwardRef((props, ref) => {
    const [tokenId, setTokenId] = useState(0);

    return (
        <div ref={ref} {...props}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Burn Card
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Enter token ID to burn. Will release it's underlying value in 
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Token ID
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {
                                console.log(tokenId);
                                let web3 = Web3Helper.getWeb3();
                                let parsed = Number.parseFloat(tokenId);
                                if (!Number.isNaN(parsed)) {
                                    Web3Helper.contracts.Coordinator.methods.burnCards([tokenId]).send(Web3Helper.getSendOptions()).then((res) => {
                                        console.info(res);
                                    }).catch((e) => {
                                        console.info(e);
                                    })
                                }
                                else {
                                    window.alert('Please input a valid token id.');
                                }
                            }}
                        >
                            Burn Card
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
});

export const MintCardPackModalContent = React.forwardRef((props, ref) => {
    const [amount, setAmount] = useState(0);
    const [stablecoinAddress, setStablecoinAddress] = useState(0);

    return (
        <div ref={ref} {...props}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Mint Cards
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Enter the address of the stablecoin you are depositing.
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Amount
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Token Address
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={stablecoinAddress} onChange={(e) => setStablecoinAddress(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {
                                console.log(amount, stablecoinAddress);
                                let web3 = Web3Helper.getWeb3();
                                let parsed = Number.parseFloat(amount);

                                if (web3.utils.isAddress(stablecoinAddress)) {
                                    let parsed = Number.parseFloat(amount);
                                    if (!Number.isNaN(parsed)) {
                                        Web3Helper.contracts.Coordinator.methods.mintCards(stablecoinAddress, parsed).send(Web3Helper.getSendOptions()).then((res) => {
                                            console.info("Deposit & mint cards", res);
                                        }).catch((e) => {
                                            console.info(e);
                                        });
                                    }
                                    else {
                                        window.alert('Please input a valid amount.');
                                    }
                                }
                                else {
                                    window.alert('Please input a valid address.');
                                }
                            }}
                        >
                            Mint Pack
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
});

export const BurnTokenForStablecoinModalContent = React.forwardRef((props, ref) => {
    const [amount, setAmount] = useState(0);

    return (
        <div ref={ref} {...props}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Burn
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Enter the amount to burn
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Amount
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {
                                let parsed = Number.parseFloat(amount);
                                if (!Number.isNaN(parsed)) {
                                    console.info(Web3Helper.contracts.Token.methods);
                                    Web3Helper.contracts.Token.methods.approve(Web3Helper.contracts.Coordinator._address, parsed).send(Web3Helper.getSendOptions()).then((res) => {
                                        Web3Helper.contracts.Coordinator.methods.burnToken(parsed, Web3Helper.contracts.USDC._address).send(Web3Helper.getSendOptions()).then((res) => {
                                            console.info("Success!");
                                        }).catch((e) => {
                                            console.info('ERROR', e);
                                        });
                                    }).catch((e) => {
                                        console.info("ERROR", e);
                                    })
                                }
                                else {
                                    window.alert('Please input a valid amount.');
                                }
                            }}
                        >
                            Burn
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
});
