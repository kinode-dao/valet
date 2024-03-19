import { FaPlus } from "react-icons/fa6"
import useValetStore from "../store/valetStore"


export const UserNodesList = () => {
  const { userNodes } = useValetStore()
  return (
    <div className='flex flex-col w-1/2 obox mr-4'>
      {userNodes.map(node => <div
        className="rounded-md bg-white/50 flex items-center justify-center mb-2"
        key={node}
      >
        {node}
      </div>)}
      <button
        className="clear"
      >
        <FaPlus className="mr-2" />
        Add
      </button>
    </div>
  )
}