import {GameAction} from "./game-action";

export abstract class GameObject {
  protected gameControl: GameControl | null = null;

  connect(_gameControl: GameControl) {
  }

  disconnect(_gameControl: GameControl) {
  }

  _internal_connect(gameControl: GameControl) {
    if (this.gameControl) {
      throw new Error('This object is already connected.');
    }

    this.gameControl = gameControl;
    this.connect(gameControl);
  }

  _internal_disconnect(gameControl: GameControl) {
    this.gameControl = null;
    this.disconnect(gameControl);
  }

  abstract on(action: GameAction): void;
}

export class GameControl {
  objects: GameObject[] = [];

  connect(gameObject: GameObject) {
    gameObject._internal_connect(this);
    this.objects = [...this.objects, gameObject];
  }

  dispatch(action: GameAction) {
    this.objects.forEach((object) => {
      object.on(action);
    });
  }

  disconnect(gameObject: GameObject) {
    gameObject._internal_disconnect(this);
    this.objects = this.objects.filter((object) => object !== gameObject);
  }
}
