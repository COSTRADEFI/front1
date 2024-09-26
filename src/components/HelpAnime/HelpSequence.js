import { useEffect, useState } from 'react'

import HelpBubble from './HelpBubble'

function isVisible(e) {
  return !!(
    e.offsetWidth ||
    e.offsetHeight ||
    e.getClientRects().length
  )
}

export const HelpSequence = (props) => {
  const [position, setPosition] = useState(0)
  const [sequence, setSequence] = useState()

  useEffect(() => {
    if (props.sequence) {
      const filter = props.sequence.filter((i) => {
        if (!i.forElement) {
          return false
        }
        const element = document.querySelector(i.forElement)
        if (!element) {
          return false
        }
        return isVisible(element)
      })
      setSequence(filter)
    } else {
      setSequence(null)
    }
  }, [props.sequence, props.open])

  const data = sequence && sequence[position]

  useEffect(() => {
    setPosition(0)
  }, [props.open])

  const onNext = () =>
    setPosition((p) => {
      console.log('p', p);
      {
        if (props.sequence) {
      const filter = props.sequence.filter((i) => {
        if (!i.forElement) {
          return false
        }
        const element = document.querySelector(i.forElement)
        if (!element) {
          return false
        }
        return isVisible(element)
      })
      setSequence(filter)
        }
      };
      if (p === sequence.length - 1) {
        props.onClose && props.onClose()
      }
      return p + 1
    })

  const onPrevious = () =>
    setPosition((p) => {
      if (p === 0) {
        props.onClose && props.onClose()
      }
      return p - 1
    })

  return (
    <div className="HelpSequence-container">
      {data && (
        <HelpBubble
          open={props.open}
          forElement={data.forElement}
          placement={data.placement}
          onClose={props.onClose}
          previousLabel={position > 0 && 'Previous'}
          nextLabel={
            position < sequence.length - 1 ? 'Next' : 'Finish'
          }
          onPrevious={onPrevious}
          onNext={onNext}
          content={data.text}
        />
      )}
    </div>
  )
}

export default HelpSequence


export const MyHelpSequence = [
  {
    forElement: '.MuiButtonBase-root',
    text: 'connect your wallet, then click next',
  },
 {
    forElement: '.ineedgetfromfaucet',
    text: 'click FAUCET to get testnet coins, then click next',
  },
  {
    forElement: '.ineedtoopenaccount',
    text: 'click OPEN to open account where you can deposit funds',
  },
  {
    forElement: '.ineedtodepositone',
    text: 'click DEPOSIT to deposit funds from your wallet to your trading account, make sure you have more than 1 APT in your wallet, then click next',
  },
  {
    forElement: '.ineedtowithdrawone',
    text: 'at all time click WITHDRAW to withdraw funds (1APT or balance)',
  },
          
  {
    forElement: '.mainfooter',
    text: 'This will tour you around the dapp',
  },
];