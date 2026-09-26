# tanbal-hooks

A collection of useful and reusable React and Next.js hooks.

## Installation

```bash
npm install tanbal-hooks
```

## Hooks

* [`useDataManager`](#usedatamanager)
* [`useLocalStorage`](#uselocalstorage)
* [`useClickOutside`](#useclickoutside)
* [`useInputBlur`](#useinputblur)
* [`useQueryParams`](#usequeryparams)

---

## useDataManager

A hook for managing data through REST API requests.

### Usage

```jsx
import useDataManager from 'tanbal-hooks';

const [data, status, actions] = useDataManager('/api/users');
```

### Return value

```js
[data, status, actions]
```

`status` can be:

```text
idle
loading
loaded
failed
```

`actions` contains:

```js
{
    load,
    add,
    update,
    updateMultiple,
    remove,
    get,
}
```

### Methods

#### `load(successCallback, failCallback, finallyCallback)`

Loads data using `GET`.

```js
await actions.load(
    data => console.log(data),
    error => console.error(error),
    () => console.log('finished')
);
```

#### `add(data, successCallback, failCallback, finallyCallback)`

Adds a new item using `POST`.

```js
await actions.add({
    name: 'Ali',
});
```

#### `update(id, newData, successCallback, failCallback, finallyCallback)`

Updates an item using `PATCH`.

```js
await actions.update(1, {
    name: 'Ali Reza',
});
```

#### `updateMultiple(updates, successCallback, failCallback, finallyCallback)`

Updates multiple items using `PATCH`.

```js
await actions.updateMultiple([
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Reza' },
]);
```

#### `remove(id, successCallback, failCallback, finallyCallback)`

Removes an item using `DELETE`.

```js
await actions.remove(1);
```

#### `get(which, key = 'id')`

Finds an item by a specified key.

```js
const user = actions.get(1);

const user = actions.get('Ali', 'name');
```

---

## useLocalStorage

A hook for storing and synchronizing a value with `localStorage`.

### Usage

```jsx
import useLocalStorage from 'tanbal-react-hooks';

const [value, setValue] = useLocalStorage('theme', 'light');
```

The hook returns:

```js
[value, setValue]
```

The stored value is automatically read from `localStorage` when the key changes and saved whenever the value changes.

---

## useClickOutside

A hook for detecting clicks outside of an element.

### Usage

```jsx
import useClickOutside from 'tanbal-react-hooks';

const ref = useClickOutside(() => {
    console.log('Clicked outside');
}, true);

return (
    <div ref={ref}>
        Content
    </div>
);
```

### Parameters

```js
useClickOutside(onOutsideClick, isActive)
```

* `onOutsideClick` — callback called when a click occurs outside the referenced element.
* `isActive` — enables or disables the listener. Defaults to `false`.

---

## useInputBlur

A hook for handling input events with a delay and executing a callback when the input loses focus.

### Usage

```jsx
import useInputBlur from 'tanbal-react-hooks';

const inputRef = useInputBlur(500, value => {
    console.log(value);
});

return <input ref={inputRef} />;
```

### Parameters

```js
useInputBlur(time, callback)
```

* `time` — delay in milliseconds before the callback is executed after input.
* `callback` — callback receiving the current input value.

The callback is also executed immediately when the input loses focus.

---

## useQueryParams

A Next.js hook for managing URL query parameters and synchronizing them with React state.

> This hook uses `next/navigation` and is intended for Next.js App Router applications.

### Usage

```jsx
import useQueryParams from 'tanbal-react-hooks';

const [query, state, setState] = useQueryParams(
    {
        search: '',
    },
    {
        search: {
            path: 'search',
        },
    }
);
```

The hook returns:

```js
[actions, state, setState]
```

### Actions

```js
{
    get,
    set,
    setMultiple,
    remove,
    removeParams,
    reset,
    getPath,
}
```

### `get(key)`

Gets a query parameter.

```js
const value = query.get('search');
```

Returns `null` when the parameter is empty or does not exist.

### `set(key, value, replace = true)`

Sets a query parameter and updates the corresponding state value.

```js
query.set('search', 'react');
```

### `setMultiple(newValues)`

Sets multiple query parameters at once.

```js
query.setMultiple({
    search: 'react',
    page: 2,
});
```

### `remove(key, replace = true)`

Removes a query parameter and clears its corresponding state value.

```js
query.remove('search');
```

### `removeParams(paramsList)`

Removes multiple query parameters.

```js
query.removeParams(['search', 'page']);
```

### `reset()`

Removes all configured query parameters.

```js
query.reset();
```

### `getPath(key)`

Returns the configured state path for a query parameter.

```js
const path = query.getPath('search');
```

### Configuration

Each query parameter can be configured with:

```js
{
    search: {
        path: 'filters.search',
        emptyValues: [''],
        inputTransform: value => value,
        paramsTransform: value => value,
    },
}
```

* `path` — path used to store the parameter in the state.
* `emptyValues` — values treated as empty.
* `inputTransform` — transforms values before storing them in the state or URL.
* `paramsTransform` — transforms values read from the URL before storing them in the state.

### Options

The third argument can be used to configure initial parameter synchronization:

```js
useQueryParams(initialState, keys, {
    syncInitialParams: true,
});
```

`syncInitialParams` defaults to `true`.

---

## License

MIT
