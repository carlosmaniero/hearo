import {GameReducer} from "./game-reducer";
import {GameAction} from "./game-action";
import {PauseAction, StartAction} from "./game-control";

export abstract class GameObject implements GameReducer {
  abstract start(): void;
  abstract pause(): void;

  reduce(action: GameAction): void {
    if (action.is(StartAction)) {
      this.start();
    }
    if (action.is(PauseAction)) {
      this.pause();
    }
  }
}
