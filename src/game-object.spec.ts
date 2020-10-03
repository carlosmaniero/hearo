import {GameControl, GameObject} from "./game-object";
import {StartAction} from "./game-control-actions";
import {GameAction} from "./game-action";

describe('Game Object', () => {
  class GameObjectTest extends GameObject {
    actionsStub = jest.fn();
    connect = jest.fn();
    disconnect = jest.fn();

    on(action: GameAction) {
      this.actionsStub(action);
    }
  }

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
