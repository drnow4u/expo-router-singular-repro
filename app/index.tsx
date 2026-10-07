import { useRouter } from "expo-router"
import { Button, View } from "react-native"

export default function List() {
    const router = useRouter()
    return (
        <View style={{ padding: 24, gap: 12 }}>
            {["A", "B", "C"].map((id) => (
                <Button key={id} testID={`open-${id}`} title={`Open item ${id}`} onPress={() => router.push(`/items/${id}`)} />
            ))}
        </View>
    )
}
