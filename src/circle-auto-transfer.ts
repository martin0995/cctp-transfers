import { wormhole, amount } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import * as dotenv from 'dotenv';
import { getSigner } from '../helpers/helpers';

dotenv.config();

(async function () {
	const wh = await wormhole('Testnet', [evm, solana]);

	const sendChain = wh.getChain('Sepolia');
	const rcvChain = wh.getChain('Avalanche');

	// Get signer from local key
	const source = await getSigner(sendChain);
	const destination = await getSigner(rcvChain);

	const amt = 200_000_000n;

	const automatic = true;

	const nativeGas = automatic ? amount.units(amount.parse("0.0", 6)) : 0n;

	const xfer = await wh.circleTransfer(amt, source.address, destination.address, automatic, undefined, nativeGas);
	
	console.log('Starting Transfer');
	const srcTxids = await xfer.initiateTransfer(source.signer);
	console.log(`Started Transfer: `, srcTxids);

	process.exit(0);
})();
