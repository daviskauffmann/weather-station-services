# Weather Station Services

REST API for a DIY weather station.

## Getting Started

Copy `example.env` and rename to `.env`. Fill out the variables with the appropriate values. Some have defaults, and can be found in `src/environment.ts`.

### Install dependencies

```bash
yarn install
```

### Build

```bash
yarn build

# to watch for changes to source files
yarn build:dev
```

### Run

```bash
yarn start

# to watch for changes to built files
yarn start:dev
```

### Test

```bash
# run the linter
yarn lint

# to automatically fix linting issues
yarn lint:fix

# run tests
yarn test

# to watch for changes
yarn test:dev
```

### Clean

```bash
# clean all build output
yarn clean
```
