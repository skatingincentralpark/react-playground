## Notes

- Disable the button when pending to prevent multiple requests
- There's better ways to mock requests, like using msw (mock service worker). [Article](https://kentcdodds.com/blog/stop-mocking-fetch). I've just gone with something simple `mockImplementationOnce` in this case.
- Testing `:hover` styles doesn't seem to be possible at the moment - I could be missing something.
