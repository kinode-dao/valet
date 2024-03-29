import kinodeLogo from '../assets/kinode.svg'
import axios from 'axios'
import useValetStore from '../store/valetStore'
import { useEffect } from 'react'
import { UserCard } from './UserCard'
import { UserNodesList } from './UserNodesList'
import { AddNodeModal } from './AddNodeModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import { UserNodeDetails } from './UserNodeDetails'
import { UserNode } from '../types/UserNode'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'

export const Home = () => {
  const { alerts, setAlerts, getServerAlerts, get, token, getUserInfo, activeNode, setActiveNode, getUserNodes, addNodeModalOpen, resetPasswordModalOpen, serverIsUnderMaintenance, expectedAvailabilityDate } = useValetStore()

  const onXClick = async () => {
    const { data } = await axios.post('http://localhost:3002/x/get-redirect-url', {}, {
      headers: {
        'accept': 'application/json',
      }
    })
    window.location.href = data;
  }

  useEffect(() => {
    if (token) {
      getUserInfo()
      getUserNodes()
      getServerAlerts()
    }
    const intervalId = setInterval(async () => {
      if (token) {
        await getUserInfo()
        await getUserNodes()
        await getServerAlerts()
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
        <div className='fixed w-full top-32 flex flex-col place-items-center'>
          {alerts.filter(a => !a.dismissed).map(alert => <div
            key={alert.id}
            className={classNames('flex items-center pl-8 text-white p-2 rounded-md', {
              'bg-red-500': alert.class === 'danger',
              'bg-yellow-500 text-black': alert.class === 'warning',
              'bg-blue-500': alert.class === 'info',
            })}>
            {alert.content}
            <button
              className='clear'
              onClick={() => setAlerts(alerts.map(a => a.id === alert.id ? { ...a, dismissed: true } : a))}
            >
              Dismiss
            </button>
          </div>)}
        </div>
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
      {serverIsUnderMaintenance && <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col place-items-center place-content-center'>
        <div className='text-white text-4xl'>Server is under maintenance. Please try again later.</div>
        <div className='text-white text-2xl'>Service estimated back up {expectedAvailabilityDate && dayjs(expectedAvailabilityDate * 1000).fromNow()}</div>
      </div>}
    </div>
  )
}