import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { UserNode } from "../types/UserNode";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from "classnames";
dayjs.extend(relativeTime)

export const UserNodeDetails: React.FC<{ node: UserNode }> = ({ node }) => {
  return <div className="flex flex-col grow">
    <div className="flex items-center flex-wrap">
      <h2>
        {node.kinode_name}.os
      </h2>
      <span className={classNames("rounded px-2 ml-2", {
        'bg-white/20': node.ship_status === 'active',
        'bg-orange': node.ship_status !== 'active'
      })}>
        status: {node.ship_status}
      </span>
      <span className="rounded bg-orange/20 px-2 ml-2">last restarted {dayjs(node.last_restarted).fromNow()}</span>
      <span className="rounded bg-orange/20 px-2 ml-2">payment {node.payment_status.toLocaleLowerCase()}</span>
    </div>
    {node.email && <div>Admin email: {node.email}</div>}
    <div
      className="flex flex-col place-items-center place-content-center self-center grow bg-orange/20 p-2 rounded self-stretch mt-2"
    >
      <span className="">Created: {dayjs(node.created_at).format('D MMM YYYY HH:mm:ss')} ({dayjs(node.created_at).fromNow()})</span>
      <span>Product: {node.product_title} - {node.product_description}</span>
      <div className="flex">
        <span>Login URL:</span>
        <a
          href={node.link}
          target="_blank"
          className={classNames("flex items-center ml-2 font-bold", { 'pointer-events-none': !node.link.startsWith('http') })}
        >
          {node.link.startsWith('http') ? node.link : '(pending)'}
          <FaArrowUpRightFromSquare className="text-[10px] ml-2" />
        </a>
      </div>
    </div>
  </div>
}

