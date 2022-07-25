import fs from "fs"

import { json } from "@remix-run/server-runtime"
import type energySchema from "@wayfarer/generated/energy.schema"
import type { z } from "zod"

import { getBareJsonFileNames } from "~/utils/fs"
import { WAYFARER_PATH } from "~/wayfarer.server"

export type Energy = z.infer<typeof energySchema>

export const createEnergy = async (energy: Energy): Promise<Energy> => (
  fs.writeFileSync(
    `${WAYFARER_PATH}/energies/${energy.id}.json`,
    JSON.stringify(energy)
  ),
  energy
)

export const readEnergy = async (id: string): Promise<Energy> =>
  JSON.parse(fs.readFileSync(`${WAYFARER_PATH}/energies/${id}.json`, "utf8"))

export const updateEnergy = async (
  id: string,
  energy: Partial<Energy>
): Promise<Energy> => {
  const currentEnergy = await readEnergy(id)
  const updatedEnergy = { ...currentEnergy, ...energy }
  fs.writeFileSync(
    `${WAYFARER_PATH}/energies/${id}.json`,
    JSON.stringify(updatedEnergy)
  )
  return updatedEnergy
}

export const getEnergyListItems = async (): Promise<Energy[]> => {
  const directoryContents = fs.readdirSync(`${WAYFARER_PATH}/energies`)
  const filenames = getBareJsonFileNames(directoryContents)
  console.log({ directoryContents, filenames })
  return Promise.all(filenames.map(readEnergy))
}
