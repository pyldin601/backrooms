import { fromEvent, merge } from 'rxjs';
import {
  distinctUntilChanged,
  groupBy,
  map,
  mergeAll,
  scan,
  tap,
  filter,
  startWith,
} from 'rxjs/operators';

export interface IKeysState {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
  Alt: boolean;
  Shift: boolean;
}

const initialKeysState: IKeysState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Alt: false,
  Shift: false,
};

const allowedKeys = new Set(Object.keys(initialKeysState));

export function createKeysStream() {
  const downs$ = fromEvent<KeyboardEvent>(document, 'keydown');
  const ups$ = fromEvent<KeyboardEvent>(document, 'keyup');

  return merge(downs$, ups$).pipe(
    filter((event) => allowedKeys.has(event.key)),
    tap((event) => event.preventDefault()),
    groupBy((event) => event.key),
    map((group) => group.pipe(distinctUntilChanged((a, b) => a.key !== b.key))),
    mergeAll(),
    scan((acc, event) => ({ ...acc, [event.key]: event.type === 'keydown' }), initialKeysState),
    startWith(initialKeysState),
  );
}
