# AaveDapp
Simply borrow Dai by depositing ETH in the Aave protocol in one click of a button.

<strong>Initial Set-Up:</strong>

1. Make sure node is installed (Used version 14.17.0, use the same to avoid potential errors.)

2. Install Truffle globally  
`npm i -g truffle`  

3. Install Ganache CLI globally  
`npm i -g ganache-cli`  

4. Download or clone this repository (you may need to install git if cloning using the command line interface - `npm i -g git`)  
`git clone https://github.com/0xJayden/AaveDapp.git`  

5. Enter the correct project directory (depends on where you downloaded/cloned the repository to)  
e.g. `cd desktop/AaveDapp`  

6. Install dependencies  
`npm install`  

<strong>How to Use:</strong>

1. Create an account on https://alchemy.com, then create a new app and fill out the required fields. Make sure that the Chain is Ethereum and the Network is Mainnet.  

2. View the details of your newly created app, click view key and copy the HTTP or Websockets key.  

3. Run a local blockchain by forking the Ethereum Mainnet using Ganache CLI with the copied key from your app in Alchemy in a separate CLI window or tab  
`ganache-cli -f pasteKeyHere`  

4. Make sure you have MetaMask installed https://metamask.io, import one of the given accounts from the local blockchain by copy pasting that account's private key in your MetaMask and connect to network LocalHost 8545.  

5. Run the DApp in the previous CLI window where you are in the project directory  
`npm start`  

Your broswer should have opened the DApp. Now, connect your MetaMask to the DApp. If the MetaMask window doesn't pop up right away, make sure you are signed into MetaMask and click the connect button and confirm the connection (this is safe). Enter the amount of ETH you'd like to deposit in exchange for Dai. A safe amount of Dai to borrow is automatically calculated based on the amount of ETH you enter using the LTV (loan to value ratio) and a safety factor to avoid liquidations. Click the Borrow Dai button. MetaMask should open where you want to confirm the transaction (you may need to edit the suggested gas fee first if it's not enough for the transaction to succeed). Once confirmed, the ETH you deposit automatically converts to WETH, sent to the Aave protocol, and sends the safe amount of Dai straight to your wallet. When the transaction completes, refresh the browser and you'll see the updated total deposited ETH amount and total borrowed Dai.
