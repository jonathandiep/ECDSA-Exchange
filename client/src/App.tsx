import React, { useState } from 'react'
import './App.scss'

import Transfer from './components/Transfer'
import Wallet from './components/Wallet'

function App() {
  const [balance, setBalance] = useState<number>(-1)
  const [sender, setSender] = useState<string>('')
  return (
    <div className="components">
      <Wallet balance={balance} sender={sender} setBalance={setBalance} setSender={setSender} />
      {sender && balance > 0 ? <Transfer sender={sender} setBalance={setBalance} /> : null}
    </div>
  )
}

export default App
