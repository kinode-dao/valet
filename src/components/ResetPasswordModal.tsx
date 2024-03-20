import { useEffect, useState } from "react"
import useValetStore from "../store/valetStore"
import { Modal } from "./Modal"
import { sha256 } from "../utilities/hash"

export const ResetPasswordModal = () => {
  const { activeNode, setResetPasswordModalOpen, resetNodePassword } = useValetStore()
  const [newPassword, setNewPassword] = useState<string>('')
  const [newPasswordHash, setNewPasswordHash] = useState<string>('')
  const [confirmNewPasswordHash, setConfirmNewPasswordHash] = useState<string>('')
  const [passwordIsResetting, setPasswordIsResetting] = useState(false)

  if (!activeNode) {
    setResetPasswordModalOpen(false)
    return null
  }

  const onNewPasswordChanged = async (np: string) => {
    setNewPassword(np)
    const hash = await sha256(np)
    setNewPasswordHash(hash)
  }

  const onConfirmPasswordChanged = async (np: string) => {
    const hash = await sha256(np)
    setConfirmNewPasswordHash(hash)
  }

  const onPasswordReset = async () => {
    if (newPassword.length < 8 || newPasswordHash !== confirmNewPasswordHash) return alert('Password must be at least 8 characters long, and passwords must match.')
    setPasswordIsResetting(true)
    const { success, error } = await resetNodePassword(activeNode, newPasswordHash)
    setPasswordIsResetting(false)
    console.log({ success, error })
    if (error) {
      alert(error)
    } else {
      alert('Password reset successfully.')
      setResetPasswordModalOpen(false)
    }
  }

  return <Modal
    onClose={() => { passwordIsResetting ? void 0 : setResetPasswordModalOpen(false) }}
    title="Reset Password"
  >
    {passwordIsResetting ? <div>Resetting password. Please wait while the Ethereum operation completes...</div> : <>
      <div className="flex mt-2">
        <input
          type="password"
          placeholder="New password"
          className="grow"
          onChange={(e) => onNewPasswordChanged(e.target.value)}
          minLength={8}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="grow"
          onChange={(e) => onConfirmPasswordChanged(e.target.value)}
          minLength={8}
        />
      </div>
      {newPassword.length < 8 && <div className="self-center my-2">Password must be at least 8 characters long.</div>}
      <div className="self-center my-2">
        {(newPasswordHash && confirmNewPasswordHash && (newPasswordHash === confirmNewPasswordHash))
          ? 'passwords match'
          : 'passwords do not match'}
      </div>
      <button
        disabled={!(newPasswordHash && confirmNewPasswordHash && (newPasswordHash === confirmNewPasswordHash))}
        onClick={onPasswordReset}
      >
        Reset Password
      </button>
    </>}
  </Modal>
}

