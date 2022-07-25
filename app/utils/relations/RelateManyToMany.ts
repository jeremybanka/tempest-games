import { nanoid } from "nanoid"

export type ElementalReaction = {
  id: string
  name: string
  time: number
  reagents: {
    [key: string]: number
  }
  products: {
    [key: string]: number
  }
}

export class ReactionManager {
  public reactions: ElementalReaction[]

  public constructor(
    load: () => ElementalReaction[],
    save: (reactions: ElementalReaction[]) => void
  ) {
    this.reactions = load()
    this.save = save
  }

  public save: (reactions: ElementalReaction[]) => void

  public getConsumers(elementId: string): ElementalReaction[] {
    return this.reactions.filter(reaction => reaction.reagents[elementId] > 0)
  }

  public getProducers(elementId: string): ElementalReaction[] {
    return this.reactions.filter(reaction => reaction.products[elementId] > 0)
  }

  public createReaction(elementId: string): ElementalReaction {
    return {
      id: nanoid(7),
      name: "new reaction",
      time: 1,
      timeUnit: "s",
      reagents: { [elementId]: 1 },
      products: { [elementId]: 1 },
    }
  }
}
