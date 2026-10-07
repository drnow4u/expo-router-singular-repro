import { Stack } from "expo-router"

// Any nested navigator triggers the bug; a Stack is the simplest.
export default function ItemLayout() {
    return <Stack />
}
