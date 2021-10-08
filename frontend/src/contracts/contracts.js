import GoGBattlesToken from './build/GoGBattlesToken.sol/GoGBattlesToken.json';
import GoGBattlesCards from './build/GoGBattlesCards.sol/GoGBattlesCards.json';
import GoGBattlesCardFactory from './build/GoGBattlesCardFactory.sol/GoGBattlesCardFactory.json';
import GoGBattlesCoordinator from './build/GoGBattlesCoordinator.sol/GoGBattlesCoordinator.json';
import GoGBattlesMatchHistory from './build/GoGBattlesMatchHistory.sol/GoGBattlesMatchHistory.json';
import GoGBattlesVault from './build/GoGBattlesVault.sol/GoGBattlesVault.json';

const contractsRaw = {
    Token: {
        ABI: GoGBattlesToken.abi,
        address: '0x407C660fC5cC4282416Ab00204696Aa655Ce9Fb2'
    },
    Cards: {
        ABI: GoGBattlesCards.abi,
        address: '0x35Da3e39aDF1d5f07732a766B141F5e27e20b4F1'
    },
    CardFactory: {
        ABI: GoGBattlesCardFactory.abi,
        address: '0x3659772b930f4BF01D1549F28300013836175192'
    },
    Coordinator: {
        ABI: GoGBattlesCoordinator.abi,
        address: '0x020C734FE9137086A3FB304687945d146C1d5F5b'
    },
    MatchHistory: {
        ABI: GoGBattlesMatchHistory.abi,
        address: '0xc2D3e989b85E41715dDEceCaB9b4B80904EcB792'
    },
    Vault: {
        ABI: GoGBattlesVault.abi,
        address: '0xAEc1F81d61132E3B2AFCc24b5A6Af6A48EADA9f0'
    }
};

export default contractsRaw;
