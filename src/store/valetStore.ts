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
  setAddNodeModalOpen: (open: boolean) => void
  checkIsNodeAvailable: (node: string) => Promise<boolean>
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
      setAddNodeModalOpen: (open: boolean) => {
        set({ addNodeModalOpen: open })
      },
      checkIsNodeAvailable: async (node: string) => {
        const token = get().token
        if (!token) return false
        const { data: isNodeAvailable } = await axios.get('http://localhost:3000/check-dot-os-availability', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          params: {
            node
          }
        })
        return Boolean(isNodeAvailable)
      },
    }),
    {
      name: 'valet', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useValetStore