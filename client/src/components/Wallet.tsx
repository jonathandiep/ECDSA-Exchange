import React from 'react'
import { SERVER } from '../util'

async function getBalance(address: string): Promise<number> {
  if (address === '') {
    return 0
  }

  try {
    const { balance } = await (await fetch(`${SERVER}/balance/${address}`)).json()
    return balance
  } catch (err) {
    console.error(err)
    return 0
  }
}

interface WalletProps {
  balance: number
  sender: string
  setBalance: React.Dispatch<number>
  setSender: React.Dispatch<string>
}

function Wallet({ balance, sender, setBalance, setSender }: WalletProps) {
  return (
    <div>
      <h1> Your Wallet </h1>
      <div>
        <textarea
          id="exchange-address"
          placeholder="Your Address"
          onChange={(event) => {
            setBalance(-1)
            setSender(event.target.value)
          }}
        />
      </div>
      <div>
        <button
          className="button"
          onClick={async () => {
            const balance = await getBalance(sender)
            setBalance(balance)
          }}
        >
          Get Balance
        </button>
      </div>
      {balance >= 0 ? <div id="balance">{balance}</div> : null}
    </div>
  )
}

export default Wallet
