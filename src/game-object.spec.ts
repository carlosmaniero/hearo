import {CompletedAction, GameControl, GameObject, GameObjectAsync, PauseAction, StartAction} from "./game-object";
import {GameAction} from "./game-action";

describe('Game', () => {
  class GameObjectTest extends GameObject {
    actionsStub = jest.fn();
    connect = jest.fn();
    disconnect = jest.fn();

    on(action: GameAction) {
      this.actionsStub(action);
    }
  }

  describe('Game Object', () => {

    it('has a default reducer for play action', () => {
      const gameObjectTest = new GameObjectTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);
      const startAction = new StartAction();
      gameControl.dispatch(startAction);

      expect(gameObjectTest.actionsStub).toBeCalledWith(startAction);
    });

    it('connects a game control', () => {
      const gameObjectTest = new GameObjectTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);

      expect(gameObjectTest.connect).toBeCalledWith(gameControl);
    });

    it('throws an error if it tries to connect twice', () => {
      const gameObjectTest = new GameObjectTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);

      expect(() => {
        gameControl.connect(gameObjectTest);
      }).toThrow();

      expect(gameObjectTest.connect).toBeCalledTimes(1);
    });

    it('disconnects a game control', () => {
      const gameObjectTest = new GameObjectTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);
      gameControl.disconnect(gameObjectTest);
      gameControl.dispatch(new StartAction());

      expect(gameObjectTest.actionsStub).not.toBeCalled();
      expect(gameObjectTest.disconnect).toBeCalledWith(gameControl);
    });

    it('allows to connect after disconnect', () => {
      const gameObjectTest = new GameObjectTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);
      gameControl.disconnect(gameObjectTest);
      gameControl.connect(gameObjectTest);

      expect(gameObjectTest.connect).toBeCalledTimes(2);
    });
  });

  describe('GameAsyncObject', () => {
    class GameObjectAsyncTest extends GameObjectAsync {
      resolveStart!: any;
      rejectStart!: any;
      readonly startPromise: Promise<void>;
      resolveResume!: any;
      rejectResume!: any;
      readonly resumePromise: Promise<void>;

      onStart = jest.fn(() => this.startPromise);
      onResume = jest.fn(() => this.resumePromise);

      onPause = jest.fn();

      constructor() {
        super();

        this.startPromise = new Promise((resolve, reject) => {
          this.resolveStart = resolve;
          this.rejectStart = reject;
        });

        this.resumePromise = new Promise((resolve, reject) => {
          this.resolveResume = resolve;
          this.rejectResume = reject;
        });
      }
    }

    it('calls start only once', () => {
      const gameObjectTest = new GameObjectAsyncTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);

      const startAction = new StartAction();

      gameControl.dispatch(startAction);
      gameControl.dispatch(startAction);

      expect(gameObjectTest.onStart).toBeCalledTimes(1);
    });

    it('calls pause when pause', () => {
      const gameObjectTest = new GameObjectAsyncTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectTest);

      gameControl.dispatch(new StartAction());
      gameControl.dispatch(new PauseAction());

      expect(gameObjectTest.onPause).toBeCalledTimes(1);
    });

    it('disconnects the object after promise fulfillment', async () => {
      const anotherGameObject = new GameObjectTest();
      const gameObjectAsyncTest = new GameObjectAsyncTest();
      const completedAction = new CompletedAction(gameObjectAsyncTest);

      const gameControl = new GameControl();
      gameControl.connect(gameObjectAsyncTest);
      gameControl.connect(anotherGameObject);
      gameControl.dispatch(new StartAction());

      expect(anotherGameObject.actionsStub).not.toBeCalledWith(completedAction);

      gameObjectAsyncTest.resolveStart();
      await gameObjectAsyncTest.startPromise;

      expect(anotherGameObject.actionsStub).toBeCalledWith(completedAction);
    });

    it('stops to listen after completed object', async () => {
      const anotherGameObject = new GameObjectTest();
      const gameObjectAsyncTest = new GameObjectAsyncTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectAsyncTest);
      gameControl.connect(anotherGameObject);
      gameControl.dispatch(new StartAction());

      gameObjectAsyncTest.resolveStart();
      await gameObjectAsyncTest.startPromise;

      gameControl.dispatch(new PauseAction());

      expect(gameObjectAsyncTest.onPause).not.toBeCalled();
    });

    it('validates that the completed action is the actual one', async () => {
      const anotherGameObject = new GameObjectTest();
      const gameObjectAsyncTest = new GameObjectAsyncTest();
      const gameControl = new GameControl();

      gameControl.connect(gameObjectAsyncTest);
      gameControl.connect(anotherGameObject);

      gameControl.dispatch(new StartAction());
      gameControl.dispatch(new CompletedAction(anotherGameObject));
      gameControl.dispatch(new PauseAction());
      gameControl.dispatch(new PauseAction());

      expect(gameObjectAsyncTest.onPause).toBeCalledTimes(1);
    });

    it('resumes a paused object', async () => {
      const anotherGameObject = new GameObjectTest();
      const gameObjectAsyncTest = new GameObjectAsyncTest();
      const completedAction = new CompletedAction(gameObjectAsyncTest);

      const gameControl = new GameControl();
      gameControl.connect(gameObjectAsyncTest);
      gameControl.connect(anotherGameObject);

      gameControl.dispatch(new StartAction());
      gameControl.dispatch(new PauseAction());
      gameControl.dispatch(new StartAction());

      expect(anotherGameObject.actionsStub).not.toBeCalledWith(completedAction);

      gameObjectAsyncTest.resolveResume();
      await gameObjectAsyncTest.resumePromise;

      expect(anotherGameObject.actionsStub).toBeCalledWith(completedAction);
    });

    it('completes once even if the another promise is resolved', async () => {
      const anotherGameObject = new GameObjectTest();
      const gameObjectAsyncTest = new GameObjectAsyncTest();
      const completedAction = new CompletedAction(gameObjectAsyncTest);

      const gameControl = new GameControl();
      gameControl.connect(gameObjectAsyncTest);

      gameControl.dispatch(new StartAction());
      gameControl.dispatch(new PauseAction());
      gameControl.dispatch(new StartAction());

      gameControl.connect(anotherGameObject);

      expect(anotherGameObject.actionsStub).not.toBeCalledWith(completedAction);

      gameObjectAsyncTest.resolveResume();
      await gameObjectAsyncTest.resumePromise;

      gameControl.connect(gameObjectAsyncTest);

      gameObjectAsyncTest.resolveStart();
      await gameObjectAsyncTest.startPromise;

      expect(anotherGameObject.actionsStub).toBeCalledTimes(1);
    });
  });
});
