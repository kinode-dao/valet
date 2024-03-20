import useValetStore from "../store/valetStore"

export const UserCard = () => {
  const { userInfo, onSignOut } = useValetStore()
  return (
    <div className="flex items-center absolute top-4 right-4 rounded-lg bg-orange/20 pl-2">
      <div>
        <span>Signed in as</span>
        <a
          target="_blank"
          className="text-orange ml-1 font-bold"
          href={`https://x.com/${userInfo?.twitterScreenName}`}
        >
          @{userInfo?.twitterScreenName}
        </a>
      </div>
      <button
        className="clear thin ml-2 px-2"
        onClick={onSignOut}
      >
        Sign Out
      </button>
    </div>
  )
}