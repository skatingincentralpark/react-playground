## Notes

- `onTransitionEnd`: Awesome event that is fired when a CSS transition has completed.
- Be careful with useEffect and dependencies. The deps determine what updated values you have within the scope of the effect. In some cases, a setState's callback argument allows you to access the latest value for that specific state.
- With small enough intervals, `setInterval` can create a smooth animation - below 16ms for a 60fps experience. (need to look into this algorithm a bit...)

## Test cases

- Hitting "Add" appends a new empty progress bar to the bottom of the list

* The first bar starts filling up as soon as it appears.

- Can add multiple progress bars, which fill up gradually one after another.

* If all existing bars are filled up, a newly added bar starts filling up immediately.

- Hit "Add" 4 times in quick succession to have 4 bars in total. The first 3 bars should start filling up and the fourth only starts filling up after the first 3 completes.
