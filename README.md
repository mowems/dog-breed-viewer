# Dog Breed Viewer

This is a small React and TypeScript project that connects to the [Dog CEO API](https://dog.ceo/dog-api/) to browse dog breeds and view random images.
The goal of the project is to demonstrate a simple but complete workflow: fetching data from an API, displaying it in the UI, handling errors, and writing unit tests.

---

## Features

- Search for breeds and sub-breeds (for example, `bulldog/boston`)
- Select a breed from a dropdown list
- Display three random images each time a breed is selected
- Option to mark images as favourites (UI only, no persistence)
- Error banner if something goes wrong with an API call
- TypeScript support throughout the project
- Unit tests written with Vitest and React Testing Library

---

## Technology

- [Vite](https://vitejs.dev/) for fast builds and development
- [React 19](https://react.dev/) for the UI
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Testing Library](https://testing-library.com/) and [Vitest](https://vitest.dev/) for testing
- CSS for basic styling

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mowems/dog-breed-viewer.git
cd dog-breed-viewer
```

### 2. Install dependencies

npm install

### 3. Start the development server

npm run dev

### 4. Run the tests

npm run test

## Project Structure

- src/components – UI components (BreedSearch, BreedSelect, ImageGrid, ErrorBanner)
- src/hooks – custom hooks (e.g., useDogBreeds)
- src/utils – helper functions (debounce, type definitions)
- src/lib – API logic

## Future Improvements

- Persist favourites using local storage or a backend
- Add more robust styling
- Expand test coverage
