import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function ItemDetails() {
    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <View style={{ padding: 24, gap: 12 }}>
            <Stack.Screen options={{ title: `Item ${id} details` }} />
            <Text testID="details-id" style={{ fontSize: 32 }}>
                Details of item {id}
            </Text>
            <Button testID="details-back" title="Back to item" onPress={() => router.back()} />
        </View>
    )
}
