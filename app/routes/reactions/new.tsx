import type { FC } from "react"
import { useEffect, useRef } from "react"

import type { ActionFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import schema from "@wayfarer/generated/reaction.schema"
import { makeDomainFunction } from "remix-domains"
import { performMutation, Form } from "remix-forms"

import { createReaction } from "~/models/reaction.server"
import { requireUserId } from "~/session.server"

type ActionData = {
  errors?: {
    title?: string
    body?: string
  }
}

const mutation = makeDomainFunction(schema)(createReaction)

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const result = await performMutation({
    request,
    schema,
    mutation,
  })

  if (result.success) {
    // type Result = typeof
    return redirect(`/energies/${result.data.id}`)
  }
  return json<ActionData>(
    { errors: { body: JSON.stringify(result.errors) } },
    { status: 400 }
  )
}

const NewReactionPage: FC = () => {
  const actionData = useActionData() as ActionData
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus()
    }
  }, [actionData])

  return <Form schema={schema} />
}
export default NewReactionPage
