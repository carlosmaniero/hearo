import {GameObject} from "./game-object";
import {PauseAction, StartAction} from "./game-control";

describe('Game Object', () => {
  class GameObjectTest extends GameObject {
    start = jest.fn();
    pause = jest.fn();
  }

  it('has a default reducer for play action', () => {
    const gameObjectTest = new GameObjectTest();

    gameObjectTest.reduce(new StartAction());
    expect(gameObjectTest.start).toBeCalled();
  });

  it('has a default reducer for pause action', () => {
    const gameObjectTest = new GameObjectTest();

    gameObjectTest.reduce(new PauseAction());
    expect(gameObjectTest.pause).toBeCalled();
  });
});
