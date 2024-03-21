import kinodeLogo from '../assets/kinode.svg'
import axios from 'axios'
import useValetStore from '../store/valetStore'
import { useEffect } from 'react'
import { UserCard } from './UserCard'
import { UserNodesList } from './UserNodesList'
import { AddNodeModal } from './AddNodeModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import { UserNodeDetails } from './UserNodeDetails'
import { DeactivateNodeModal } from './DeactivateNodeModal'
import { UserNode } from '../types/UserNode'

export const Home = () => {
  const { get, token, getUserInfo, activeNode, setActiveNode, userNodes, getUserNodes, addNodeModalOpen, resetPasswordModalOpen, deactivateNodeModalOpen } = useValetStore()

  const onXClick = async () => {
    const { data } = await axios.post('http://localhost:3002/x/get-redirect-url', {}, {
      headers: {
        'accepts': 'application/json',
      }
    })
    window.location.href = data;
  }

  useEffect(() => {
    if (token) {
      getUserInfo()
      getUserNodes()
    }
    const intervalId = setInterval(async () => {
      if (token) {
        await getUserInfo()
        await getUserNodes()
        const { userNodes, activeNode } = get()
        if (activeNode) {
          const thatNode = userNodes.find((n: UserNode) => n.id === activeNode.id)
          console.log({ thatNode })
          if (thatNode) setActiveNode(thatNode)
        }
      }
    }, 10000)

    return () => clearInterval(intervalId)
  }, [token])

  return (
    <div className='flex flex-col place-items-center place-content-center h-screen w-screen'>
      {token && <UserCard />}
      <div className='flex flex-col place-items-center'>
        <h1 className='display text-6xl'>Valet</h1>
        <img src={kinodeLogo} className='w-1/4 mt-16 mb-8' />
      </div>
      {!token && <div className='text-2xl mt-6 mb-12'>
        Manage your Kinodes, all in one place.
      </div>}
      {!token && <button
        className='bg-blue-500 text-lg border-blue-200'
        onClick={onXClick}
      >
        Sign in with X
      </button>}
      {token && <>
        <div className='flex w-full p-4'>
          <UserNodesList />
          <div className='flex flex-col w-1/2 overflow-y-auto obox'>
            {activeNode
              ? <UserNodeDetails node={activeNode} />
              : 'Select a node on the left-hand side.'
            }
          </div>
        </div>
      </>}
      {addNodeModalOpen && <AddNodeModal />}
      {resetPasswordModalOpen && <ResetPasswordModal />}
      {deactivateNodeModalOpen && <DeactivateNodeModal />}
    </div>
  )
}