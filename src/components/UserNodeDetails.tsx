import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { UserNode } from "../types/UserNode";

export const UserNodeDetails: React.FC<{ node: UserNode }> = ({ node }) => {
  return <div className="flex flex-col">
    <h2>{node.kinode_name}.os</h2>
    <div>Admin email: {node.email || 'None'}</div>
    <div className="flex">URL: <a href={node.link} target="_blank" className="flex items-center ml-2 text-orange">{node.link} <FaArrowUpRightFromSquare className="text-xs ml-2" /></a></div>
  </div>
}

