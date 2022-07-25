import type { FC } from "react"

import { Link } from "@remix-run/react"

const ReactionIndexPage: FC = () => {
  return (
    <p>
      No reaction selected. Select a reaction on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new reaction.
      </Link>
    </p>
  )
}
export default ReactionIndexPage
