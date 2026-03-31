import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";
import { getCurrentUserProfile, logOut } from "../lib/auth";
import { getOpenRequests } from "../lib/requests";

type RequestItem = {
  id: string;
  title: string;
  details?: string;
  status: string;
  createdBy: string;
  claimedBy?: string | null;
};

export default function FeedScreen() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [role, setRole] = useState<string | null>(null);

  async function loadData() {
    try {
      const profile = await getCurrentUserProfile();
      setRole((profile as any)?.role ?? null);

      const data = await getOpenRequests();
      setRequests(data as RequestItem[]);
    } catch (error: any) {
      alert(error?.message || "Failed to load feed");
    }
  }

  async function handleLogout() {
    await logOut();
    router.replace("/login");
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 16 }}>
        Open Requests
      </Text>

      <Text style={{ marginBottom: 12 }}>Role: {role || "unknown"}</Text>

      {role === "requester" && (
        <View style={{ marginBottom: 12 }}>
          <Button
            title="Create Request"
            onPress={() => router.push("/create-request")}
          />
        </View>
      )}

      <View style={{ marginBottom: 12 }}>
        <Button title="Refresh" onPress={loadData} />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text>{item.details || "No details"}</Text>
            <Text>Status: {item.status}</Text>

            <View style={{ marginTop: 8 }}>
              <Button
                title="View Request"
                onPress={() =>
                  router.push({
                    pathname: "/request/[id]",
                    params: { id: item.id },
                  })
                }
              />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No open requests.</Text>}
      />
    </SafeAreaView>
  );
}
