import type { FC } from "react"

import { Link } from "@remix-run/react"

const EnergyIndexPage: FC = () => {
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  )
}
export default EnergyIndexPage
