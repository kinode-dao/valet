import useValetStore from "../store/valetStore"

export const UserCard = () => {
  const { userInfo, onSignOut } = useValetStore()
  return (
    <div className="obox flex items-center absolute top-4 right-4">
      <div className="mx-4">@{userInfo?.twitterScreenName}</div>
      <button
        className="clear"
        onClick={onSignOut}
      >Sign Out</button>
    </div>
  )
}