## Outline
An uncontrolled tab component.  A controlled component will require value and onChange as props

Note on keys: Keys must be unique among siblings. However, it’s okay to use the same keys for JSX nodes in different arrays.
Hence able to initialise multiple instances of this component.

## keypress vs keydown
- The keypress event is also deprecated.
- The keypress event is only fired when a key that produces a character value is pressed down. Excludes Left, Right, Home, and End keys.

## Focusing new tab on left/right arrow key press
This approach is non-idiomatic by usual React standards but is acceptable during interviews.

## Only active tab is focusable from the outside
A standard according to the [WAI-ARIA Tabs specification](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

Using tabIndex, we can control the focusability of an element. A value of 0 means that the element is focusable and reachable through the keyboard, but its order is defined by the document's source order. A value of -1 means that the element is focusable but not reachable through the keyboard.

```tsx
<button tabIndex={active ? 0 : -1}>
  Press me
</button>
```

## Testing Library: User Event - Keyboard
[Docs](https://testing-library.com/docs/user-event/keyboard)

Keys can be kept pressed by adding a > to the end of the descriptor.
If this should result in repeated keydown events, you can add the number of repetitions.
If the key should also be released after this, add a slash / to the end of the descriptor.

```ts
keyboard('{a>}') // press a without releasing it
keyboard('{a>5}') // press a without releasing it and trigger 5 keydown
keyboard('{a>5/}') // press a for 5 keydown and then release it
```

A previously pressed key can be lifted by prefixing the descriptor with /.

```ts
keyboard('{/a}') // release a previously pressed a
```

This allows to simulate key combinations ⭐️.

```ts
keyboard('{Shift>}A{/Shift}') // translates to: Shift(down), A, Shift(up)
keyboard("{Shift>}{tab}{/Shift}"); // translates to: Shift(down), Tab, Shift(up)
```

## Asserting non-existence of element
Asserting elements are not present

The standard getBy methods throw an error when they can't find an element, so if you want to make an assertion that an element is not present in the DOM, you can use queryBy APIs instead:

```tsx
const submitButton = screen.queryByText('submit')
expect(submitButton).toBeNull() // it doesn't exist
```

The queryAll APIs version return an array of matching nodes. The length of the array can be useful for assertions after elements are added or removed from the DOM.

```tsx
const submitButtons = screen.queryAllByText('submit')
expect(submitButtons).toHaveLength(2) // expect 2 elements
not.toBeInTheDocument
```

The jest-dom utility library provides the  .toBeInTheDocument() matcher, which can be used to assert that an element is in the body of the document, or not. This can be more meaningful than asserting a query result is null.

```tsx
import '@testing-library/jest-dom/extend-expect'
// use `queryBy` to avoid throwing an error with `getBy`
const submitButton = screen.queryByText('submit')
expect(submitButton).not.toBeInTheDocument()
```

## Resources
[Common mistakes with react testing library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
[Testing Library Types of queries](https://testing-library.com/docs/queries/about/)
[Vitest Test API Reference (e.g. test.only, test.todo)](https://vitest.dev/api/#test)
[Vitest Expect API Reference (e.g. toHaveLength, toBe)](https://vitest.dev/api/expect.html)
