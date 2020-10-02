import {GameAction} from "./game-action";

export abstract class GameReducer {
  abstract reduce(action: GameAction): void
}
