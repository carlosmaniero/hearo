import {GameAction} from "./game-action";

describe('Game Action', () => {
  class ActionA extends GameAction {
  }

  class ActionB extends GameAction {
    c = 1
  }

  it('has a type guard to validate if the action is the same', () => {
    const action: GameAction = new ActionB();

    expect(action.is(ActionB)).toBeTruthy();
    expect(action.is(ActionA)).toBeFalsy();

    // validate type guard
    action.is(ActionB) && expect(action.c).toBe(1);
  });
});
