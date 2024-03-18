import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ValetStore {
}

const useValetStore = create<ValetStore>()(
  persist(
    (set, get) => ({
      set,
      get,
    }),
    {
      name: 'valet', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useValetStore