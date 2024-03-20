import { useState } from 'react'
import useValetStore from '../store/valetStore'
import { Modal } from './Modal'
import { createHash } from 'crypto'
import { sha256 } from '../utilities/hash'

enum AddNodeStage {
  CheckAvailability = 1,
  ChoosePassword = 2,
  Boot = 3,
}

export const AddNodeModal = () => {
  const { setAddNodeModalOpen, checkIsNodeAvailable, bootNode, getUserNodes } = useValetStore()
  const [nodeName, setNodeName] = useState('')
  const [stage, setStage] = useState(AddNodeStage.CheckAvailability)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [passwordHash, setPasswordHash] = useState<string>('')
  const [confirmPasswordHash, setConfirmPasswordHash] = useState<string>('')

  const onNodeNameChanged = (name: string) => {
    setAvailable(null)
    setStage(AddNodeStage.CheckAvailability)
    setNodeName(name.replace(/\./g, '').replace(/\s/g, '').toLowerCase())
  }

  const onCheckAvailable = async () => {
    let isAvail = await checkIsNodeAvailable(nodeName);
    setAvailable(isAvail)
    if (isAvail) {
      setStage(AddNodeStage.ChoosePassword)
    } else {
      setStage(AddNodeStage.CheckAvailability)
    }
  }

  const onPasswordChanged = async (password: string) => {
    const hashHex = await sha256(password)
    setPasswordHash(hashHex)
  };

  const onConfirmPasswordChanged = async (password: string) => {
    const hashHex = await sha256(password)
    setConfirmPasswordHash(hashHex)
  };

  const onBootNode = async () => {
    setStage(AddNodeStage.Boot)
    const { success, error } = await bootNode(nodeName, passwordHash)
    if (success) {
      await getUserNodes()
      setAddNodeModalOpen(false)
    } else {
      setStage(AddNodeStage.ChoosePassword)
      setPasswordHash('')
      setConfirmPasswordHash('')
      alert(`Something went wrong: ${error}. Please try again.`)
    }
    console.log({ success, error })
  }

  return <Modal title="Add a new node" onClose={() => setAddNodeModalOpen(false)}>
    <div className='flex place-items-center place-content-center'>
      <span className='self-center mr-2'>Node name:</span>
      <input
        type="text"
        value={nodeName}
        onChange={(e) => onNodeNameChanged(e.target.value)}
        placeholder='some-sweet-moniker'
      />
      <span className='mr-2'>.os</span>
      <button
        onClick={() => onCheckAvailable()}
        disabled={stage !== AddNodeStage.CheckAvailability || nodeName === ''}
      >
        {stage === AddNodeStage.CheckAvailability ? 'Check availability' : 'Available'}
      </button>
    </div>
    {available === false && <div className='my-2 self-center'>Name not available.</div>}
    {stage === AddNodeStage.ChoosePassword && <div className='flex flex-col border border-white border-b-0 border-l-0 border-r-0 mt-4'>
      <div className='self-center my-2'>
        Choose a strong password for {nodeName}.os.
      </div>
      <div className='flex'>
        <input
          type="password"
          onChange={(e) => onPasswordChanged(e.target.value)}
          placeholder='password'
          className='grow'
        />
        <input
          type="password"
          onChange={(e) => onConfirmPasswordChanged(e.target.value)}
          placeholder='confirm password'
          className='grow'
        />
      </div>
      {(passwordHash !== confirmPasswordHash || passwordHash === '' || confirmPasswordHash === '')
        ? <div className='my-2 self-center'>Passwords do not match.</div>
        : <button
          onClick={() => onBootNode()}
          className='mt-2'
        >
          Boot node
        </button>}
    </div>}
    {stage === AddNodeStage.Boot && <div className='flex flex-col'>
      <div className='self-center'>Booting {nodeName}...</div>
    </div>}
  </Modal>
}

