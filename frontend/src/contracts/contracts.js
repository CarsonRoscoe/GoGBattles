import GoGBattlesToken from './build/GoGBattlesToken.sol/GoGBattlesToken.json';
import GoGBattlesCards from './build/GoGBattlesCards.sol/GoGBattlesCards.json';
import GoGBattlesCardFactory from './build/GoGBattlesCardFactory.sol/GoGBattlesCardFactory.json';
import GoGBattlesCoordinator from './build/GoGBattlesCoordinator.sol/GoGBattlesCoordinator.json';
import GoGBattlesMatchHistory from './build/GoGBattlesMatchHistory.sol/GoGBattlesMatchHistory.json';
import GoGBattlesVault from './build/GoGBattlesVault.sol/GoGBattlesVault.json';
import ERC20 from './build/ERC20.sol/ERC20.json';

const contractsRaw = {
    Token: {
        ABI: GoGBattlesToken.abi,
        address: '0x09Fb489471B8D6288b8414DECf94961C6BB21009'
    },
    Cards: {
        ABI: GoGBattlesCards.abi,
        address: '0x2aAd36f22a673799Be3198AA190D40b1e374FA72'
    },
    CardFactory: {
        ABI: GoGBattlesCardFactory.abi,
        address: '0x5b472FfC45119E575f01f3B469721ba03e6798B8'
    },
    Coordinator: {
        ABI: GoGBattlesCoordinator.abi,
        address: '0xd98150c9E42511c14FE35e06fE83142d60Ed44fd'
    },
    MatchHistory: {
        ABI: GoGBattlesMatchHistory.abi,
        address: '0x1F9cB17aB90421f96A9E2D967bca69ceA6bBB542'
    },
    Vault: {
        ABI: GoGBattlesVault.abi,
        address: '0x09cd12f5896bb820f3aE5c4Ae24178C486291854'
    },
    DAI: {
        ABI: ERC20.abi,
        address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
    },
    aDAI : {
        ABI: ERC20.abi,
        address: '0x639cB7b21ee2161DF9c882483C9D55c90c20Ca3e'
    },
    USDC: {
        ABI: ERC20.abi,
        address: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
    },
    aUSDC: {
        ABI: ERC20.abi,
        address: '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9'
    }
};

export default contractsRaw;
