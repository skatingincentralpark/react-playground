## Solution

Text from [here](https://www.greatfrontend.com/questions/user-interface/analog-clock/solution).

We can separate out the solution into two parts, the update loop and the rendering.

## Update loop
We need a timer to refresh the page and display the current time every second. To create the timer, we can use a setInterval and kick off the update loop in a useEffect.

- Cleanup timer in useEffect to prevent "setState on unmounted component" errors and memory leaks.
- For better reusability, abstract into custom useCurrentDate hook.
- The update frequency of the timer depends on how accurate we want the clock to be. The maximum we can set is 1000ms, however, the clock's accuracy might be off by 1000ms in the case we load the page nearing the last millisecond of the second. However, using too small of an interval can be quite expensive because of too frequent updates. Hence a middleground we've chosen is 100ms. The clock can only ever be off by 100ms, which is not very noticeable by humans.
- The current date/time should be polled in each loop, as opposed to recording the time when the clock was first rendered and incrementing based on the interval duration of the timer because the invocations of the loop can be delayed by processes hogging the main thread and the loop may not run at every fixed interval.

## Rendering
- For better reusability, make clock size a prop.  Hands will be a proportion of clock.
- To render the clock hands in the right position, we use a combination of position: absolute and CSS transforms.

## Test Cases
See that the second hand updates every second.
Observe the clock for a minute to see that the minute hand updates correctly (gradually moved since the observation started).
Check that the hour hand's position is different when it's not an exact hour, aka the hour hand's position at 12.00pm and 12.30pm should be different.

## Accessibility
For a11y reasons, use a <time> element with datetime attribute set to the current time in 24-hour format so that screen readers can read this component. Otherwise the component will be ignored by screen readers, which is bad. Add the aria-hidden attribute to the internals of <time> since they are for presentation purposes and not useful to screen readers.

## Notes

## Getting the hours, seconds and minutes
```ts
const date = new Date(); // returns Date object, so you can call instance functions on it, useful to get hours/mins/secs for clock
const date = Date.now() // returns number of milliseconds since Unix epoch (midnight 01 January, 1970 UTC)
```
