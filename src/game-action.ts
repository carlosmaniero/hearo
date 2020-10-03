type ActionConstructor<GameActionType extends GameAction> = {
  new(...args: any[]): GameActionType
};

export abstract class GameAction {
  is<GameActionType extends GameAction>(actionConstructor: ActionConstructor<GameActionType>): this is GameActionType {
    return this instanceof actionConstructor;
  }
}
