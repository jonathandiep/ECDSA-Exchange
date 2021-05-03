const express = require('express')
const app = express()
const cors = require('cors')
const EC = require('elliptic').ec
const SHA256 = require('crypto-js/sha256')
const ec = new EC('secp256k1')
const port = 3042

app.use(cors())
app.use(express.json())

const accounts = []
const balances = {}

function generateKeys() {
  const key = ec.genKeyPair()
  const public = key.getPublic().encode('hex')
  return {
    public,
    private: key.getPrivate().toString(16),
    address: SHA256(public).toString().slice(-40),
  }
}

for (let i = 0; i < 3; i++) {
  const account = generateKeys()
  accounts.push(account)
  balances[account.public] = 100
}

console.log('')
console.log('Available Accounts')
console.log('==================')
accounts.forEach((account, index) => console.log(`(${index}) ${account.public} (${balances[account.public]})`))
console.log('')
console.log('Private Keys')
console.log('==================')
accounts.forEach((account, index) => console.log(`(${index}) ${account.private}`))

app.get('/generate', (_req, res) => {
  res.send(generateKeys())
})

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post('/send', (req, res) => {
  const { message, r, s } = req.body
  const { sender, recipient, amount } = JSON.parse(message)
  // ec.verify(message, { r, s })
  // ec.keyFromPublic
  const verified = ec.keyFromPublic(sender, 'hex').verify(message, { r, s })
  if (!verified) {
    res.send({
      success: false,
      message: 'Invalid signature',
    })
    return
  }

  if (balances[sender] < amount) {
    res.send({
      success: false,
      message: 'Cannot send more than you already have',
    })
    return
  }
  balances[sender] -= amount
  balances[recipient] = (balances[recipient] || 0) + +amount
  res.send({ success: true, balance: balances[sender] })
})

app.listen(port, () => {
  console.log(`Listening on port ${port} 🚀`)
})
