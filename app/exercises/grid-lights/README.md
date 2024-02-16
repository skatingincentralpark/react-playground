## Checking for existence in array

- Just do `someArr.includes(something)`.
- Initially, I did `someArr.find(x => x === something)`, but it could break if any falsey value is in the array. Would need to do `someArr.find(x => x === something) !== undefined`.

## Use HTML attributes whenever possible

- A button has `disabled` which we can use to prevent interaction, rather than having that logic in the click handler. It's handy as the button could be disabled due to other states too.

## Using setState callback to get latest state

Since useState `set` only updates for the next render, need to use the setState callback to get the latest value.

```tsx
❌
function deactivate() {
  setDeactiviating(true);

  const interval = setInterval(() => {
    if (!clickedItems.length) {
      setDeactiviating(false);
      clearInterval(interval);
      return;
    }

    setClickedItems((ci) => ci.slice(0, -1));
  }, 300);
}
```

✅

```tsx
function deactivate() {
  setDeactiviating(true);

  const interval = setInterval(() => {
    setClickedItems((ci) => {
      if (ci.length === 1) {
        setDeactiviating(false);
        clearInterval(interval);

        return ci.slice(0, -1);
      }

      return ci.slice(0, -1);
    });
  }, 300);
}
```

A simpler example can be shown here:

❌

```tsx
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

✅

```tsx
function handleClick() {
  setAge((a) => a + 1); // setAge(42 => 43)
  setAge((a) => a + 1); // setAge(43 => 44)
  setAge((a) => a + 1); // setAge(44 => 45)
}
```

## Tests

### Async

Async doesn't work with `forEach` - doesn't wait for async events to complete ([more on sequence vs parallel operations](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)):

```ts
❌
cells.forEach(() => {
  await user.click(cells[cell]);
})

✅
for (let cell in cells) {
  await user.click(cells[cell]);
}

✅
for (let i = 0; i < orderToClick.length; i++) {
  await user.click(cells[orderToClick[i]]);
}
```

### Timing

Advance fake timers:

```ts
it("does something", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  vi.advanceTimersByTime(450);

  await waitFor(() => {
    return expect(cells[5]).toBeDisabled();
  });
});
```

Set a higher timeout for `waitFor`. Makes tests longer:

```ts
it("does something", () => {
  await waitFor(() => {
    return expect(cells[5]).toBeDisabled();
  }, 3000); // ⏰
});
```

### Not wrapped in act warning

[Kent C Dodds article](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning)

Could happen when:

- Updating state asynchronously, e.g. a callback that changes state after a timeout.
- Using fake timers.

The act warning from React is there to tell us that something happened to our component when we weren't expecting anything to happen. React automatically handles this for any of your code that's running within the React callstack (like click events). But it cannot handle this for any code running outside of it's own callstack (like asynchronous code that runs as a result of a resolved promise you are managing or if you're using jest fake timers). With those kinds of situations you typically need to wrap that in act(...) or async act(...) yourself. BUT, React Testing Library has async utilities that are wrapped in act automatically!

You shouldn't have to use it very often. It's built-into React Testing Library. There are very few times you should have to use it directly if you're using React Testing Library's async utilities.

### Don't test implementation details

[Article 1 - migrating from enzyme](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/)
[Article 2 - testing impl. details](https://kentcdodds.com/blog/testing-implementation-details)

Historically, Enzyme was used until React testing library came onto the block. [Enzyme allowed and encouraged devs to test implementation details](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#why-should-i-use-react-testing-library) (internal APIs and state), which led to brittle tests (refactor a component would necessitate a refactor in tests).

Rewriting your tests in React Testing library is worthwhile because you'll be trading tests that slow you down for tests that give you more confidence and increase your productivity in the long run. RTL makes it difficult to include impl. details.

Implementation details are things which **users** of your code will not typically use, see, or even know about (internal APIs).

Who is the **user** of this code?

1. End-user - They'll be observing and interacting with the rendered buttons and contents.
2. Developer - Will be rendering the accordion with props

So our test should typically only see/interact with the props that are passed, and the rendered output. This is precisely what the React Testing Library test does. We give it our own React element of the Accordion component with our fake props. Now consider the enzyme test. With enzyme, we access the state of openIndex. This is not something that either of our users care about directly, they don't know if it's stored as a prim or array and they don't care.

This [process](https://kentcdodds.com/blog/testing-implementation-details#conclusion) helps to have the right mindset when testing: Write down a list of instructions for that user to manually test that code to make sure it's not broken. (render the form with some fake data in the cart, click the checkout button, ensure the mocked /checkout API was called with the right data, respond with a fake successful response, make sure the success message is displayed). Turn that list of instructions into an automated test.

Testing impl. details leads to:

1. Can break when you refactor application code. **False negatives**
2. May not fail when you break application code. **False positives**

Here we're testing that the internal API works, not simulating user interaction.

```ts
test("setOpenIndex sets the open index state properly", () => {
  const wrapper = mount(<Accordion items={[]} />);
  expect(wrapper.state("openIndexes")).toEqual([0]);
  wrapper.instance().setOpenIndex(1);
  expect(wrapper.state("openIndexes")).toEqual([1]);
});
```

Coworker may change the onClick in an attempt to optimise (reduce creation of inline callback), but incidentally breaks the wiring of the button to `setOpenIndex`.

```tsx
class Accordion extends React.Component {
  state = { openIndexes: [0] };
  setOpenIndex = (openIndex) => this.setState({ openIndexes: [openIndex] });

  render() {
    const { openIndexes } = this.state;

    // ...
    return this.props.items.map((item, index) => (
      <button onClick={() => this.setOpenIndex(index)}>{item.title}</button>
    ));
    // ...
  }
}

class Accordion extends React.Component {
  state = { openIndexes: [0] };
  setOpenIndex = (openIndex) => this.setState({ openIndexes: [openIndex] });

  render() {
    const { openIndexes } = this.state;

    // ...
    return this.props.items.map((item, index) => (
      <button onClick={this.setOpenIndex}>{item.title}</button>
    ));
    // ...
  }
}
```
