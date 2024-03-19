import useValetStore from "../store/valetStore"

export const UserCard = () => {
  const { userInfo, onSignOut } = useValetStore()
  return (
    <div className="obox flex items-center absolute top-4 right-4">
      <div className="mx-4">
        <span>Signed in as</span>
        <a
          target="_blank"
          className="text-orange ml-1"
          href={`https://x.com/${userInfo?.twitterScreenName}`}
        >
          @{userInfo?.twitterScreenName}
        </a>
      </div>
      <button
        className="clear thin px-2"
        onClick={onSignOut}
      >Sign Out</button>
    </div>
  )
}