import kinodeLogo from '../assets/kinode.svg'
import axios from 'axios'
import useValetStore from '../store/valetStore'
import { useEffect } from 'react'
import { UserCard } from './UserCard'
import { UserNodesList } from './UserNodesList'

export const Home = () => {
  const { token, getUserInfo, getUserNodes } = useValetStore()

  const onXClick = async () => {
    const { data } = await axios.post('http://localhost:3000/x/get-redirect-url', {}, {
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
          <div className='flex flex-col w-1/2 obox'>
          </div>
        </div>
      </>}
    </div>
  )
}