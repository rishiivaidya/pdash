import { router } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { createRequest } from "../lib/requests";

export default function CreateRequestScreen() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  async function handleCreate() {
    try {
      await createRequest(title, details);
      alert("Request created");
      router.replace("/feed");
    } catch (error: any) {
      alert(error?.message || "Failed to create request");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Create Request
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Submit Request" onPress={handleCreate} />

      <View style={{ marginTop: 10 }}>
        <Button title="Back to Feed" onPress={() => router.replace("/feed")} />
      </View>
    </SafeAreaView>
  );
}
