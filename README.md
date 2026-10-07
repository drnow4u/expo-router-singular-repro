# expo-router: `dangerouslySingular` route re-keyed for a new id keeps the previous id's nested state

Minimal reproduction (created with `npx create-expo-app@latest --template blank-typescript@sdk-57`, only Expo packages added).

## Structure

```
app/
  _layout.tsx            Tabs: "index" (list) + "items/[id]" with dangerouslySingular, href: null
  index.tsx              buttons that router.push("/items/A" | "/items/B" | "/items/C")
  items/[id]/_layout.tsx Stack (any nested navigator)
  items/[id]/index.tsx   shows the id; "Open details" and "Back to list" (router.navigate("/"))
  items/[id]/details.tsx shows the id; "Back to item" (router.back())
```

## Steps (web; same router code runs on iOS/Android)

```
npm install
npx expo start --web
```

1. Press **Open item A**: shows "Item A".
2. Press **Open details**, then **Back to item**: the nested Stack now has stored its state on the `items/[id]` tab route.
3. Press **Back to list** (switches tab with `router.navigate("/")`, no history pop).
4. Press **Open item B**.

**Expected:** "Item B", URL `/items/B`.
**Actual:** "Item A", URL changes to `/items/A`.

Skipping step 2 does not reproduce it: an untouched nested navigator never writes its state to the parent route.

## Router-only check (no UI)

```
node router-repro.js
```

Drives `TabRouter.getStateForAction` directly and fails while the re-keyed route still carries the previous id's state.

## Cause

`TabRouter` (`build/react-navigation/routers/TabRouter.js`, `NAVIGATE`/`JUMP_TO`) gives the route a new key when `getId`
returns a new id, but returns `{ ...route, key, path, params }`, so `route.state` (item A's Stack) is kept. The new key
remounts the nested navigator, which adopts that state and ignores `params.screen`/`params.params` for item B.

Dropping `state` when the key changes fixes it:

```diff
+                            if (key !== route.key) {
+                                const { state: _previousState, ...rest } = route;
+                                return { ...rest, key, path, params };
+                            }
                             return params !== route.params || path !== route.path
                                 ? { ...route, key, path, params }
                                 : route;
```
