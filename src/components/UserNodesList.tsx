import { FaPlus } from "react-icons/fa6"
import useValetStore from "../store/valetStore"
import { UserNodeDisplay } from "./UserNodeDisplay"


export const UserNodesList = () => {
  const { userNodes, setAddNodeModalOpen } = useValetStore()
  return (
    <div
      className='flex flex-col w-1/2 obox mr-4'
    >
      <h2 className="self-center mb-4">Your Kinodes</h2>
      {userNodes?.length > 0
        ? userNodes.map(node => <UserNodeDisplay node={node} key={node.id} />)
        : <span className="self-center mb-2">You don't have any nodes yet.</span>}
      <button
        className="clear mt-2"
        onClick={() => setAddNodeModalOpen(true)}
      >
        <FaPlus className="mr-2" />
        Add
      </button>
    </div>
  )
}