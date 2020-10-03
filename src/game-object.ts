import {GameAction} from "./game-action";

export class PauseAction extends GameAction {
}

export class StartAction extends GameAction {
}

export class CompletedAction extends GameAction {
  constructor(readonly object: GameObject) {
    super();
  }
}


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

  protected dispatch(action: GameAction) {
    if (!this.gameControl) {
      return;
    }
    this.gameControl.dispatch(action)
  }

  abstract on(action: GameAction): void;
}

export abstract class GameObjectAsync extends GameObject {
  started = false;
  running = false;
  private runningPromise?: Promise<void>;

  on(action: GameAction): void {
    if (action.is(StartAction)) {
      this.start();
      this.resume();
    }

    if (action.is(PauseAction)) {
      this.pause();
    }

    if (action.is(CompletedAction) && action.object === this) {
      this.gameControl?.disconnect(this);
    }
  }

  pause() {
    if (!this.running) {
      return;
    }

    this.running = false;
    this.onPause();
  }

  start() {
    if (this.started) {
      return;
    }

    this.started = true;
    this.running = true;

    this._internal_listen_to_promise(this.onStart());
  }

  resume() {
    if (!this.started || this.running) {
      return;
    }

    this.started = true;
    this.running = true;

    this._internal_listen_to_promise(this.onResume());
  }

  private _internal_listen_to_promise(promise: Promise<void>) {
    this.runningPromise = promise;

    promise.then(() => {
      if (promise === this.runningPromise) {
        this.dispatch(new CompletedAction(this));
      }
    });
  }

  abstract onStart(): Promise<void>
  abstract onPause(): void
  abstract onResume(): Promise<void>
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
