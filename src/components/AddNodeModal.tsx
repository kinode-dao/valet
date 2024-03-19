import { useState } from 'react'
import useValetStore from '../store/valetStore'
import { Modal } from './Modal'

export const AddNodeModal = () => {
  const { setAddNodeModalOpen, checkIsNodeAvailable } = useValetStore()
  const [nodeName, setNodeName] = useState('')
  const [availableNames, setAvailableNames] = useState<{ [key: string]: boolean }>({})

  const onCheckAvailable = async () => {
    const available = await checkIsNodeAvailable(nodeName)
    setAvailableNames({ ...availableNames, [nodeName]: available })
  }
  return <Modal title="Add a new node" onClose={() => setAddNodeModalOpen(false)}>
    <div className='flex'>
      <input
        type="text"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        placeholder='Node name'
      />
      <button
        onClick={() => onCheckAvailable()}
        disabled={availableNames[nodeName] === false}
      >
        {availableNames[nodeName] === undefined ? 'Check availability' : availableNames[nodeName] ? 'Available' : 'Not available'}
      </button>
    </div>
  </Modal>
}

