## Notes

- `onTransitionEnd`: Awesome event that is fired when a CSS transition has completed.

## Test cases

- Hitting "Add" appends a new empty progress bar to the bottom of the list

* The first bar starts filling up as soon as it appears.

- Can add multiple progress bars, which fill up gradually one after another.

* If all existing bars are filled up, a newly added bar starts filling up immediately.

- Hit "Add" 4 times in quick succession to have 4 bars in total. The first 3 bars should start filling up and the fourth only starts filling up after the first 3 completes.