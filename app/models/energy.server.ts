import fs from 'fs';

const WAYFARER_PATH = process.cwd() + "/wayfarer"

export type Energy = {
  id: string;
  name: string;
  color: string;
  icon: string;
}
export const createEnergy = (energy: Energy) => 
  fs.writeFileSync(`${WAYFARER_PATH}/energy/${energy.id}.json`, JSON.stringify(energy, null, 2))



export const readEnergy = async (
  id: string,
) => JSON.parse(fs.readFileSync(`${WAYFARER_PATH}/energies/${id}.json`, "utf8"));

export const updateEnergy = async (id: string, energy: Energy) =>