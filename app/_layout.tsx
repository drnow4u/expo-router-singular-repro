import { Tabs } from "expo-router"

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "List" }} />
            {/* One tab instance per id: a new id should give a fresh screen. */}
            <Tabs.Screen name="items/[id]" dangerouslySingular options={{ title: "Item", href: null }} />
        </Tabs>
    )
}
