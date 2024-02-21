## Two ways to implement start/pause

1. capture the time elapsed as:

```
on every loop tick, time_when_you_clicked_start - time_now + time_elapsed_when_last_clicked_pause
```

2. capture the time elapsed as:

```
on every loop tick, last_tick_time - current_tick_time
```

## Bug note

First snippet works, second doesn't, occurs only in dev (strict mode) where the set state is called twice.

Strict mode means components will re-render an extra time to find bugs caused by impure rendering. It helps find bugs that exist but are tricky to reliably reproduce in prod. It can help uncover non-deterministic rendering behaviour - React assumes that every component you write is a pure function. This means that React components you write must always return the same JSX given the same inputs (props, state, and context) ([source](https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development)).

This works ✅:

```tsx
const interval = setInterval(() => {
  const now = Date.now();
  const delta = now - lastTickTime.current;
  setTimeElapsed((t) => {
    lastTickTime.current = Date.now();
    return t + delta;
  });
}, 1000);
```

This doesn't ❌:

```tsx
const interval = setInterval(() => {
  setTimeElapsed((t) => {
    const now = Date.now();
    const delta = now - lastTickTime.current;

    lastTickTime.current = Date.now();
    return t + delta;
  });
}, 1000);
```

I think it's because, since React is calling the set state twice, its recomputing the `now` value, which will cause the delta to be 0 on the 2nd immediate set state... but not sure exactly how to explain the strange delayed behaviour. Logs below:

```
3 Ticks - good ✅
-------------
1708477622264
1708477621262
1002
---
1708477622264
1708477622271
1002
-------------
1708477623264
1708477622271
993
---
1708477623264
1708477623270
993
-------------
1708477624265
1708477623270
995
---
1708477624265
1708477624268
995

3 Ticks - bad ❌
-------------
1708477407800
1708477406795
1005
---
1708477407801
1708477407801
0
-------------
1708477408797
1708477407801
996
---
1708477408803
1708477408798
5
-------------
1708477409802
1708477408803
999
---
1708477409803
1708477409803
0
```
