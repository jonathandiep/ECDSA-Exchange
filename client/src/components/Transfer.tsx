import React, { useState } from 'react'
import { ec } from 'elliptic'
import { SERVER } from '../util'

const e = new ec('secp256k1')

async function sendAmount(
  sender: string,
  recipient: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; message?: string; balance?: number }> {
  const message = JSON.stringify({ sender, recipient, amount })
  const { r, s } = e.keyFromPrivate(privateKey).sign(message)

  const body = JSON.stringify({
    message,
    r,
    s,
  })
  const request = new Request(`${SERVER}/send`, { method: 'POST', body })
  return await (await fetch(request, { headers: { 'Content-Type': 'application/json' } })).json()
}

interface TransferProps {
  sender: string
  setBalance: React.Dispatch<number>
}

function Transfer({ sender, setBalance }: TransferProps) {
  const [amount, setAmount] = useState<number>()
  const [error, setError] = useState<string>()
  const [privateKey, setPrivateKey] = useState<string>('')
  const [recipientAddress, setRecipientAddress] = useState<string>('')

  return (
    <div className="send">
      <h1> Send Amount </h1>
      {error ? <h3 style={{ color: 'red' }}>{error}</h3> : null}
      <div>
        <textarea
          id="recipient"
          placeholder="Recipient"
          onChange={(event) => setRecipientAddress(event.target.value)}
        />
      </div>
      <div>
        <textarea
          id="send-amount"
          placeholder="Send Amount"
          onChange={(event) => setAmount(Number(event.target.value))}
        />
      </div>
      <div>
        <textarea placeholder="Private Key" onChange={(event) => setPrivateKey(event.target.value)} />
      </div>

      <div
        className="button"
        id="transfer-amount"
        onClick={async () => {
          if (amount) {
            const { success, ...data } = await sendAmount(sender, recipientAddress, amount, privateKey)
            if (success && data.balance) {
              setBalance(data.balance)
              setError('')
            } else if (data.message) {
              setError(data.message)
            }
          }
        }}
      >
        Transfer Amount
      </div>
      <div>
        <p>NOTE: In real dapps you should NEVER paste your private keys</p>
      </div>
    </div>
  )
}

export default Transfer
