import { FaPlus } from "react-icons/fa6"
import useValetStore from "../store/valetStore"


export const UserNodesList = () => {
  const { userNodes, setAddNodeModalOpen } = useValetStore()
  return (
    <div className='flex flex-col w-1/2 obox mr-4'>
      {userNodes?.length > 0
        ? userNodes.map(node => <div
          className="rounded-md bg-white/50 flex items-center justify-center mb-2"
          key={node}
        >
          {node}
        </div>)
        : <span className="self-center mb-2">You don't have any nodes yet.</span>}
      <button
        className="clear"
        onClick={() => setAddNodeModalOpen(true)}
      >
        <FaPlus className="mr-2" />
        Add
      </button>
    </div>
  )
}