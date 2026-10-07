import { Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function Item() {
    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>()
    const global = useGlobalSearchParams<{ id: string }>()
    return (
        <View style={{ padding: 24, gap: 12 }}>
            <Stack.Screen options={{ title: `Item ${id}` }} />
            <Text testID="item-id" style={{ fontSize: 32 }}>
                Item {id}
            </Text>
            <Text testID="global-id">Global id param: {global.id}</Text>
            {/* Any navigation inside the nested stack stores its state on the parent tab route. */}
            <Button testID="open-details" title="Open details" onPress={() => router.push(`/items/${id}/details`)} />
            {/* Switch back to the list tab without popping history. */}
            <Button testID="to-list" title="Back to list" onPress={() => router.navigate("/")} />
        </View>
    )
}
