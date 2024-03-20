import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import { UserInfo, isUserInfoValid } from '../types/UserInfo'
import { UserNode } from '../types/UserNode'

export interface ValetStore {
  token: string
  setToken: (token: string) => void
  getUserInfo: () => Promise<void>
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo | null) => void
  getUserNodes: () => Promise<void>
  userNodes: UserNode[]
  setUserNodes: (nodes: UserNode[]) => void
  onSignOut: () => void
  addNodeModalOpen: boolean
  setAddNodeModalOpen: (addNodeModalOpen: boolean) => void
  resetPasswordModalOpen: boolean
  setResetPasswordModalOpen: (resetPasswordModalOpen: boolean) => void
  checkIsNodeAvailable: (node: string) => Promise<boolean>
  bootNode: (kinodeName: string, passwordHash: string) => Promise<{ success: boolean, error: boolean | string }>
  resetNodePassword: (node: UserNode, passwordHash: string) => Promise<{ success: boolean, error: boolean | string }>
  removeUserNode: (node: UserNode) => Promise<{ success: boolean, error: boolean | string }>
  activeNode: UserNode | null
  setActiveNode: (node: UserNode | null) => void
}

const useValetStore = create<ValetStore>()(
  persist(
    (set, get) => ({
      set,
      get,
      token: '',
      activeNode: null,
      setActiveNode: (node: UserNode | null) => set({ activeNode: node }),
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
        set({ userNodes })
      },
      userNodes: [],
      setUserNodes: (userNodes: UserNode[]) => set({ userNodes }),
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
      resetPasswordModalOpen: false,
      setResetPasswordModalOpen: (resetPasswordModalOpen: boolean) => {
        set({ resetPasswordModalOpen })
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
        if (!token) return { success: false, error: 'Token is required. Please log in.' }
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
      resetNodePassword: async (node: UserNode, passwordHash: string) => {
        const token = get().token
        if (!token) return { success: false, error: 'Token is required. Please log in.' }
        if (node.kinode_name.includes('.')) {
          node.kinode_name = node.kinode_name.split('.')[0]
        }
        if (!passwordHash.startsWith('0x')) {
          passwordHash = '0x' + passwordHash
        }
        try {
          const { data } = await axios.put(`http://localhost:3000/reset-kinode-password/${node.kinode_name}`, {
            kinodePassword: passwordHash
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          console.log(data)
          return { success: true, error: false }
        } catch (e: any) {
          console.error('reset password error', e)
          return { success: false, error: e.response?.data?.message || 'Server Error' }
        }
      },
      removeUserNode: async (node: UserNode) => {
        const token = get().token
        if (!token) return { success: false, error: 'Token is required. Please log in.' }
        if (node.kinode_name.includes('.')) {
          node.kinode_name = node.kinode_name.split('.')[0]
        }
        try {
          const { data } = await axios.put(`http://localhost:3000/deactivate-kinode/${node.kinode_name}`, {
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          console.log(data)
          return { success: true, error: false }
        } catch (e: any) {
          console.error('reset password error', e)
          return { success: false, error: e.response?.data?.message || 'Server Error' }
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