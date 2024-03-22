import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import { UserInfo, isUserInfoValid } from '../types/UserInfo'
import { UserNode } from '../types/UserNode'
import { middleware } from '../utilities/middleware'
import { ServerAlert } from '../types/ServerAlert'

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
  activeNode: UserNode | null
  setActiveNode: (node: UserNode | null) => void
  serverIsUnderMaintenance: boolean
  setServerIsUnderMaintenance: (serverIsUnderMaintenance: boolean) => void
  expectedAvailabilityDate: number | null
  setExpectedAvailabilityDate: (expectedAvailabilityDate: number | null) => void
  alerts: ServerAlert[]
  setAlerts: (alerts: ServerAlert[]) => void
  getServerAlerts: () => Promise<void>
  get: () => ValetStore
  set: (state: ValetStore) => void
}

const useValetStore = create<ValetStore>()(
  persist(
    (set, get) => ({
      set,
      get,
      token: '',
      activeNode: null,
      serverIsUnderMaintenance: false,
      expectedAvailabilityDate: null,
      alerts: [],
      setAlerts: (alerts: ServerAlert[]) => set({ alerts }),
      setExpectedAvailabilityDate: (expectedAvailabilityDate: number | null) => set({ expectedAvailabilityDate }),
      setServerIsUnderMaintenance: (serverIsUnderMaintenance: boolean) => set({ serverIsUnderMaintenance }),
      setActiveNode: (node: UserNode | null) => set({ activeNode: node }),
      setToken: (token: string) => set({ token }),
      getUserInfo: async () => {
        const { token, setServerIsUnderMaintenance, setExpectedAvailabilityDate } = get()
        if (!token) return
        const result = await middleware(axios.get('http://localhost:3002/get-user-info-x', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }))
        if (result.maintenance) {
          setServerIsUnderMaintenance(true)
          setExpectedAvailabilityDate(result.expectedAvailability)
          return
        }
        setServerIsUnderMaintenance(false)
        setExpectedAvailabilityDate(null)
        if (result.error) {
          return alert(result.message)
        }
        else if (result.data && isUserInfoValid(result.data)) {
          set({ userInfo: result.data })
        }
      },
      userInfo: null,
      setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),
      getServerAlerts: async () => {
        const { token, alerts, setAlerts } = get()
        if (!token) return
        const result = await middleware(axios.get('http://localhost:3002/alerts', {
          headers: {
            'Content-Type': 'application/json',
            'client_id': 2,
          }
        }))
        setAlerts(result.data?.alerts.map((a: ServerAlert) => ({ ...a, dismissed: alerts.find(b => b.id === a.id)?.dismissed || false })) || []);
      },
      getUserNodes: async () => {
        const { token, activeNode, setActiveNode, setServerIsUnderMaintenance, setExpectedAvailabilityDate } = get()
        if (!token) return
        const result = await middleware(axios.get('http://localhost:3002/get-user-kinodes', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }))
        if (result.maintenance) {
          setServerIsUnderMaintenance(true)
          setExpectedAvailabilityDate(result.expectedAvailability)
          return
        }
        setServerIsUnderMaintenance(false)
        setExpectedAvailabilityDate(null)
        if (result.error) {
          return alert(result.message)
        }
        if (activeNode && !result.data.find((n: UserNode) => n.id === activeNode.id)) {
          setActiveNode(null)
        }
        set({ userNodes: result.data })
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
        const { token, setServerIsUnderMaintenance, setExpectedAvailabilityDate } = get()
        if (!token) return false
        if (node.endsWith('.os')) {
          node = node.replace('.os', '')
        }
        const result = await middleware(axios.get(`http://localhost:3002/check-dot-os-availability/${node}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }))
        if (result.maintenance) {
          setServerIsUnderMaintenance(true)
          setExpectedAvailabilityDate(result.expectedAvailability)
          return false
        }
        setServerIsUnderMaintenance(false)
        setExpectedAvailabilityDate(null)
        if (result.error) {
          alert(result.message)
          return false
        }
        return Boolean(result.data)
      },
      bootNode: async (kinodeName: string, passwordHash: string) => {
        const { token, setServerIsUnderMaintenance, setExpectedAvailabilityDate } = get()
        if (!token) return { success: false, error: 'Token is required. Please log in.' }
        if (!passwordHash.startsWith('0x')) {
          passwordHash = '0x' + passwordHash
        }
        if (kinodeName.includes('.')) {
          kinodeName = kinodeName.split('.')[0]
        }
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        console.log({ headers })
        const result = await middleware(axios.post('http://localhost:3002/free-kinode-eligibility-boot', {
          productId: 2,
          kinodeName,
          kinodePassword: passwordHash
        },
          { headers }
        ))
        if (result.maintenance) {
          setServerIsUnderMaintenance(true)
          setExpectedAvailabilityDate(result.expectedAvailability)
          return { success: false, error: 'Server Maintenance in Progress' }
        }
        setServerIsUnderMaintenance(false)
        setExpectedAvailabilityDate(null)
        if (result.error) {
          return { success: false, error: result.message }
        }
        return { success: (Boolean(result.data.eligible) || Boolean(result.data.message)), error: result.data.reason || false }
      },
      resetNodePassword: async (node: UserNode, passwordHash: string) => {
        const { token, setServerIsUnderMaintenance, setExpectedAvailabilityDate } = get()
        if (!token) return { success: false, error: 'Token is required. Please log in.' }
        if (node.kinode_name.includes('.')) {
          node.kinode_name = node.kinode_name.split('.')[0]
        }
        if (!passwordHash.startsWith('0x')) {
          passwordHash = '0x' + passwordHash
        }
        const result = await middleware(axios.put(`http://localhost:3002/reset-kinode-password/${node.id}`, {
          kinodePassword: passwordHash
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }))
        if (result.maintenance) {
          setServerIsUnderMaintenance(true)
          setExpectedAvailabilityDate(result.expectedAvailability)
          return { success: false, error: 'Server Maintenance in Progress' }
        }
        setServerIsUnderMaintenance(false)
        setExpectedAvailabilityDate(null)
        if (result.error) {
          return { success: false, error: result.message }
        }
        return { success: true, error: false }
      },
    }),
    {
      name: 'valet', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useValetStore