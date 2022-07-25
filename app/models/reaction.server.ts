import fs from "fs"

import type schema from "@wayfarer/generated/reaction.schema"
import type { z } from "zod"

import { getBareJsonFileNames } from "~/utils/fs"
import { WAYFARER_PATH } from "~/wayfarer.server"

export type Reaction = z.infer<typeof schema>

export const createReaction = async (reaction: Reaction): Promise<Reaction> => (
  fs.writeFileSync(
    `${WAYFARER_PATH}/energies/reactions/${reaction.id}.json`,
    JSON.stringify(reaction)
  ),
  reaction
)

export const readReaction = async (id: string): Promise<Reaction> =>
  JSON.parse(
    fs.readFileSync(`${WAYFARER_PATH}/energies/reactions/${id}.json`, "utf8")
  )

export const updateReaction = async (
  id: string,
  reaction: Partial<Reaction>
): Promise<Reaction> => {
  const currentReaction = await readReaction(id)
  const updatedReaction = { ...currentReaction, ...reaction }
  fs.writeFileSync(
    `${WAYFARER_PATH}/energies/reactions/${id}.json`,
    JSON.stringify(updatedReaction)
  )
  return updatedReaction
}

export const getReactionListItems = async (): Promise<Reaction[]> => {
  const directoryContents = fs.readdirSync(`${WAYFARER_PATH}/energies/reactions`)
  const filenames = getBareJsonFileNames(directoryContents)
  console.log({ directoryContents, filenames })
  return Promise.all(filenames.map(readReaction))
}
