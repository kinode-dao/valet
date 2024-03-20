import { FaTrash, FaUnlock, FaUserLock } from "react-icons/fa6"
import { UserNode } from "../types/UserNode"
import useValetStore from "../store/valetStore"
import classNames from "classnames"
import { useEffect } from "react"

export const UserNodeDisplay: React.FC<{ node: UserNode }> = ({ node }) => {
  const { userNodes, activeNode, setResetPasswordModalOpen, setActiveNode, setDeactivateNodeModalOpen } = useValetStore()
  useEffect(() => {
    if (activeNode && !userNodes.find(n => n.id === activeNode?.id)) {
      setActiveNode(null)
    } else {
      const updated = userNodes.find(n => n.id === activeNode?.id)
      if (updated) {
        setActiveNode(updated)
      }
    }
  }, [userNodes, activeNode, setActiveNode])

  return <div
    className={classNames("flex items-center self-stretch hover:bg-white/35 cursor-pointer rounded px-4 py-2", {
      'bg-white/25': activeNode && activeNode.id === node.id,
      'bg-orange/25': !activeNode || activeNode.id !== node.id,
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
        onClick={() => setDeactivateNodeModalOpen(true)}
      >
        <FaTrash />
      </button>
    </div>
  </div>
}