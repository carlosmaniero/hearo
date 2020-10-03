import {GameControl, GameObjectAsync, StartAction} from "@hearo/game-object";

class Speaker extends GameObjectAsync {
  private readonly speechSynthesisUtterance: SpeechSynthesisUtterance;

  constructor(message: string, language: string = 'pt-BR') {
    super();
    this.speechSynthesisUtterance = new SpeechSynthesisUtterance(message);
    this.speechSynthesisUtterance.lang = language;
  }

  onPause(): void {
    window.speechSynthesis.pause();
  }

  async onResume() {
    window.speechSynthesis.resume();
  }

  async onStart() {
    window.speechSynthesis.speak(this.speechSynthesisUtterance)
  }
}


window.onload = () => {
  const gameControl = new GameControl();

  gameControl.connect(new Speaker("Bem-vindo ao"));
  gameControl.dispatch(new StartAction());
  gameControl.connect(new Speaker("Hear o - A Game framework for listeners", 'en-GB'));
  gameControl.dispatch(new StartAction());
  gameControl.connect(new Speaker("Vamos jogar!"));
  gameControl.dispatch(new StartAction());
  gameControl.connect(new Speaker("Boo ooooo ora!"));
  gameControl.dispatch(new StartAction());
}

document.body.style.background = 'red';
