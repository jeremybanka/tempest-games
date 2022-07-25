import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import type { Energy } from "~/models/energy.server"
import { updateEnergy, readEnergy } from "~/models/energy.server"
import { deleteNote } from "~/models/note.server"
import { requireUserId } from "~/session.server"

type LoaderData = {
  energy: Energy
}

export const loader: LoaderFunction = async ({ request, params }) => {
  // const userId = await requireUserId(request);
  invariant(params.energyId, "energyId not found")

  console.log(params)

  const energy = await readEnergy(params.energyId)
  if (!energy) {
    throw new Response("Not Found", { status: 404 })
  }
  return json<LoaderData>({ energy })
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const _method = form.get("_method")
  const name = form.get("name")
  console.log({ _method, name })
  const userId = await requireUserId(request)
  invariant(params.energyId, "noteId not found")
  switch (_method) {
    case "delete":
      await deleteNote({ userId, id: params.energyId })
      return redirect("/notes")
    case "put":
      if (typeof name !== `string`) {
        throw new Error("Invalid request")
      }
      await updateEnergy(params.energyId ?? ``, { name })
      return null
  }
}

const NoteDetailsPage: FC = () => {
  const data = useLoaderData() as LoaderData

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.energy.name}</h3>
      <p className="py-6">{data.energy.id}</p>
      <hr className="my-4" />
      <Form method="post">
        <input readOnly type="hidden" name="_method" value="put" />
        <input name="name" defaultValue={data.energy.name} />
        <button type="submit">Update</button>
      </Form>
      <Form method="post">
        <input readOnly hidden name="_method" value="delete" />
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  )
}
export default NoteDetailsPage

export const ErrorBoundary: FC<{ error: Error }> = ({ error }) => {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export const CatchBoundary: FC = () => {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Note not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
