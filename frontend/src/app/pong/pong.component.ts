import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, interval } from 'rxjs';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  game_title = "FT PONG";
  left_score = 0;
  right_score = 0;

  //pong gamer left
  left_up = "z";
  left_down = "s";

  //pong gamer right
  right_up = "ArrowUp";
  right_down = "ArrowDown";
  right_up_pressed: boolean = false;
  right_down_pressed: boolean = false;

  el!: HTMLElement | null;

  fup$ = fromEvent<KeyboardEvent>(window, "keyup");
  fdown$ = fromEvent<KeyboardEvent>(window, "keydown");

  //une class racket
  // qui prend une racket en entree
  // qui fournit des fonction pour la deplacer vers le haut ou le bas
  //
  // definition racket:
  //  une div racket,
  //  position top min,
  //  position top max,
  //  position top part defaut

  // interval:
  //  interval(1000).subscribe(reaction);
  // event:
  //  event.subscribe(reaction);

  constructor() {
  }

  ngOnInit(): void {
    interval(1000).subscribe(() => {
      this.tick();
    });
  }

  ngAfterViewInit() {
    this.fup$.pipe(filter(event => !event.repeat)).subscribe((event) => {
      console.log("up", event.key);
      this.toUp(event.key);
      /*if (event.key === this.left_up) {
        this.left_score += 1;
        this.el = document.getElementById('left-racket');
        if (this.el) {
          console.log(this.el.style.top);
          this.el.style.top = 20 + 'px';
          console.log(this.el.style.top);
        }
      } else if (event.key === this.left_down) {
        this.right_score += 1;
      }*/
   });
   this.fdown$.pipe(filter(event => !event.repeat)).subscribe((event) => {
    console.log("down", event.key);
    this.toDown(event.key);
 });
  }

  eventHandler(keyCode: KeyboardEvent) {
    console.log('Key pressed is:', keyCode);
  }

  toUp(key: string) {
    if (key === this.right_up) {
      this.right_up_pressed = false;
    } else if (key === this.right_down) {
      this.right_down_pressed = false;
    }
  }

  toDown(key: string) {
    if (key === this.right_up) {
      this.right_up_pressed = true;
    } else if (key === this.right_down) {
      this.right_down_pressed = true;
    }
  }

  tick(): void {
    if (this.right_down_pressed && !this.right_up_pressed) {
      console.log("right to down");
    } else if (!this.right_down_pressed && this.right_up_pressed) {
      console.log("right to up");
    }
  }
}
