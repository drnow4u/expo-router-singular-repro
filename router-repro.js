// Minimal repro: TabRouter (used by Tabs and Drawer) keeps a route's nested navigator state when
// `dangerouslySingular` / getId re-keys the route for a new id.
//
// Usage: node router-repro.js   (exits non-zero while the bug is present)
const assert = require("node:assert/strict")
const path = require("node:path")

const pkg = path.resolve(process.argv[2] || "node_modules/expo-router")
const { TabRouter } = require(path.join(pkg, "build/react-navigation/routers/TabRouter.js"))

const routeNames = ["index", "items/[id]"]
// What `dangerouslySingular` (true) generates for `items/[id]`: the route name with the param filled in.
const routeGetIdList = { "items/[id]": ({ params } = {}) => `items/${params?.id}` }
const config = { routeNames, routeParamList: {}, routeGetIdList }

const router = TabRouter({})
const navigate = (state, name, params) =>
    router.getStateForAction(state, { type: "NAVIGATE", payload: { name, params } }, config)
const itemRoute = (state) => state.routes.find((r) => r.name === "items/[id]")
const nestedParams = (route) => route.state?.routes[route.state.index ?? 0]?.params

// 1. Open item A. Its nested layout (e.g. items/[id]/_layout.tsx with a Stack) mounts and stores its state on the route.
let state = router.getInitialState(config)
state = navigate(state, "items/[id]", { id: "A", screen: "index", params: { id: "A" } })
const routeA = itemRoute(state)
state = {
    ...state,
    routes: state.routes.map((r) =>
        r.key === routeA.key
            ? { ...r, state: { type: "stack", key: "stack-1", index: 0, routes: [{ name: "index", key: "index-1", params: { id: "A" } }] } }
            : r,
    ),
}

// 2. Go back to the list by switching tab (no history pop), then open item B.
state = navigate(state, "index")
state = navigate(state, "items/[id]", { id: "B", screen: "index", params: { id: "B" } })
const routeB = itemRoute(state)

console.log("expo-router", require(path.join(pkg, "package.json")).version)
console.log("route key changed:", routeA.key !== routeB.key)
console.log("route params.id:", routeB.params.id)
console.log("nested state kept:", routeB.state !== undefined, "-> nested params:", JSON.stringify(nestedParams(routeB)))

assert.notEqual(routeB.key, routeA.key, "a new id should re-key the route")
assert.equal(routeB.state, undefined, "re-keyed route still carries the previous id's nested state (id A)")
console.log("PASS")
