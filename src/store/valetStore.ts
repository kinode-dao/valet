import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import { UserInfo, isUserInfoValid } from '../types/UserInfo'

export interface UserNode { }

export interface ValetStore {
  token: string
  setToken: (token: string) => void
  getUserInfo: () => Promise<void>
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo | null) => void
  getUserNodes: () => Promise<void>
  userNodes: string[]
  setUserNodes: (nodes: string[]) => void
  onSignOut: () => void
  addNodeModalOpen: boolean
  setAddNodeModalOpen: (addNodeModalOpen: boolean) => void
  checkIsNodeAvailable: (node: string) => Promise<boolean>
  bootNode: (kinodeName: string, passwordHash: string) => Promise<{ success: boolean, error: boolean | string }>
}

const useValetStore = create<ValetStore>()(
  persist(
    (set, get) => ({
      set,
      get,
      token: '',
      setToken: (token: string) => set({ token }),
      getUserInfo: async () => {
        const token = get().token
        if (!token) return
        const { data: userInfo } = await axios.get('http://localhost:3000/get-user-info-x', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        console.log({ userInfo })
        if (isUserInfoValid(userInfo)) {
          set({ userInfo })
        }
      },
      userInfo: null,
      setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),
      getUserNodes: async () => {
        const token = get().token
        if (!token) return
        const { data: userNodes } = await axios.get('http://localhost:3000/get-user-kinodes', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        console.log({ userNodes })
      },
      userNodes: [],
      setUserNodes: (nodes: string[]) => set({ userNodes: nodes }),
      onSignOut: () => {
        const { setToken, setUserInfo, setUserNodes } = get()
        setToken('')
        setUserInfo(null)
        setUserNodes([])
      },
      addNodeModalOpen: false,
      setAddNodeModalOpen: (addNodeModalOpen: boolean) => {
        set({ addNodeModalOpen })
      },
      checkIsNodeAvailable: async (node: string) => {
        const token = get().token
        if (!token) return false
        if (node.endsWith('.os')) {
          node = node.replace('.os', '')
        }
        const { data: isNodeAvailable } = await axios.get(`http://localhost:3000/check-dot-os-availability/${node}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        return Boolean(isNodeAvailable)
      },
      bootNode: async (kinodeName: string, passwordHash: string) => {
        const token = get().token
        if (!token) return { success: false, error: true }
        if (!passwordHash.startsWith('0x')) {
          passwordHash = '0x' + passwordHash
        }
        if (kinodeName.includes('.')) {
          kinodeName = kinodeName.split('.')[0]
        }
        try {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
          console.log({ headers })
          const { data: { eligible, reason } } = await axios.post('http://localhost:3000/free-kinode-eligibility-boot', {
            productId: 2,
            kinodeName,
            kinodePassword: passwordHash
          },
            { headers }
          )
          console.log({ eligible, reason })
          return { success: Boolean(eligible), error: reason || false }
        } catch (e: any) {
          console.error('boot error', e)
          return {
            success: false,
            error: e.response?.data?.message || 'Server Error'
          }
        }
      },
    }),
    {
      name: 'valet', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useValetStore