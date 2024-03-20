import { FaTrash, FaUnlock, FaUserLock } from "react-icons/fa6"
import { UserNode } from "../types/UserNode"
import useValetStore from "../store/valetStore"
import classNames from "classnames"

export const UserNodeDisplay: React.FC<{ node: UserNode }> = ({ node }) => {
  const { activeNode, setResetPasswordModalOpen, setActiveNode } = useValetStore()
  return <div
    className={classNames("flex obox items-center self-stretch hover:bg-white/25 cursor-pointer", {
      'bg-white/25': activeNode && activeNode.id === node.id
    })}
    onClick={() => setActiveNode(node)}
  >
    <span className="grow">{node.kinode_name}.os</span>
    <div className="flex">
      <button
        className="icon ml-2"
        onClick={() => setResetPasswordModalOpen(true)}
      >
        <FaUnlock />
      </button>
      <button
        className="icon ml-2"
      >
        <FaTrash />
      </button>
    </div>
  </div>
}