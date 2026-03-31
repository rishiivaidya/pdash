import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { getCurrentUserProfile } from "../../lib/auth";
import {
  claimRequest,
  getRequestById,
  markRequestDone,
} from "../../lib/requests";

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  async function loadRequest() {
    try {
      const profile = await getCurrentUserProfile();
      setRole((profile as any)?.role ?? null);

      if (!id) {
        throw new Error("Missing request id");
      }

      const data = await getRequestById(id);
      setRequest(data);
    } catch (error: any) {
      alert(error?.message || "Failed to load request");
    }
  }

  async function handleClaim() {
    try {
      if (!id) {
        throw new Error("Missing request id");
      }

      await claimRequest(id);
      alert("Request claimed");
      await loadRequest();
    } catch (error: any) {
      alert(error?.message || "Failed to claim request");
    }
  }

  async function handleDone() {
    try {
      if (!id) {
        throw new Error("Missing request id");
      }

      await markRequestDone(id);
      alert("Request marked done");
      router.replace("/feed");
    } catch (error: any) {
      alert(error?.message || "Failed to mark done");
    }
  }

  useEffect(() => {
    loadRequest();
  }, []);

  if (!request) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Request Details
      </Text>

      <Text style={{ fontWeight: "700", fontSize: 20, marginBottom: 8 }}>
        {request.title}
      </Text>

      <Text style={{ marginBottom: 8 }}>
        {request.details || "No details"}
      </Text>

      <Text style={{ marginBottom: 20 }}>Status: {request.status}</Text>

      {role === "helper" && request.status === "OPEN" && (
        <View style={{ marginBottom: 10 }}>
          <Button title="Claim Request" onPress={handleClaim} />
        </View>
      )}

      {role === "helper" &&
        (request.status === "CLAIMED" || request.status === "IN_PROGRESS") && (
          <View style={{ marginBottom: 10 }}>
            <Button title="Mark Done" onPress={handleDone} />
          </View>
        )}

      <Button title="Back to Feed" onPress={() => router.replace("/feed")} />
    </SafeAreaView>
  );
}
