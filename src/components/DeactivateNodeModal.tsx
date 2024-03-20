import { useState } from "react"
import useValetStore from "../store/valetStore"
import { Modal } from "./Modal"

export const DeactivateNodeModal = () => {
  const { activeNode, setActiveNode, setDeactivateNodeModalOpen, deactivateNode, getUserNodes } = useValetStore()
  const [deactivatePending, setDeactivatePending] = useState(false)

  if (!activeNode) {
    setDeactivateNodeModalOpen(false)
    return null
  }

  const onDeactivateNode = async () => {
    setDeactivatePending(true)
    const { success, error } = await deactivateNode(activeNode)
    setDeactivatePending(false)
    if (success) {
      setDeactivateNodeModalOpen(false)
      alert(`${activeNode?.kinode_name} has been deactivated.`)
      setActiveNode(null)
      getUserNodes()
    } else {
      alert(error)
    }
  }

  return <Modal
    onClose={() => { deactivatePending ? void 0 : setDeactivateNodeModalOpen(false) }}
    title={`Deactivate ${activeNode?.kinode_name}.os`}
  >
    {deactivatePending
      ? <>
        <h3 className="self-center">Deactivating {activeNode?.kinode_name}.os, please wait...</h3>
      </> : <>
        <h3 className="self-center">Are you sure you want to deactivate {activeNode?.kinode_name}.os?</h3>
        <h4 className="self-center mb-4">This action cannot be undone.</h4>
        <div className="flex self-stretch">
          <button
            className="grow"
            onClick={onDeactivateNode}
          >
            Deactivate
          </button>
          <button
            className="alt grow ml-2"
            onClick={() => setDeactivateNodeModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </>}
  </Modal>
}

