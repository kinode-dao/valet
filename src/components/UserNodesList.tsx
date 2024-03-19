import useValetStore from "../store/valetStore"

export const UserNodesList = () => {
  const { userNodes } = useValetStore()
  return (
    <div className='flex flex-col w-1/2 obox mr-4'>
      Nodes go here!
    </div>
  )
}