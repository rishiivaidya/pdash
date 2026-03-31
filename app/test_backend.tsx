import { useState } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { logIn, signUp } from "../lib/auth";
import {
  claimRequest,
  createRequest,
  getOpenRequests,
} from "../lib/requests";

type RequestItem = {
  id: string;
  title: string;
  details?: string;
  status: string;
  createdBy: string;
  claimedBy?: string | null;
};

export default function TestBackendScreen() {
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    try {
      console.log("Sign up clicked");
      await signUp(name, email, password);
      alert("Signed up successfully");
    } catch (error: any) {
      console.error("Signup failed:", error);
      alert(error?.message || "Signup failed");
    }
  }

  async function handleLogIn() {
    try {
      console.log("Log in clicked");
      await logIn(email, password);
      alert("Logged in successfully");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed");
    }
  }

  async function handleCreateRequest() {
    try {
      console.log("Create request clicked");
      await createRequest(title, details);
      alert("Request created");
      setTitle("");
      setDetails("");
    } catch (error: any) {
      console.error("Create failed:", error);
      alert(error?.message || "Create failed");
    }
  }

  async function loadRequests() {
    try {
      console.log("Load requests clicked");
      setLoading(true);
      const data = await getOpenRequests();
      setRequests(data as RequestItem[]);
    } catch (error: any) {
      console.error("Load failed:", error);
      alert(error?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(requestId: string) {
    try {
      console.log("Claim clicked:", requestId);
      await claimRequest(requestId);
      alert("Request claimed");
      await loadRequests();
    } catch (error: any) {
      console.error("Claim failed:", error);
      alert(error?.message || "Claim failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Backend Test Screen
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 8 }}>Auth</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      />

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <Button title="Sign Up" onPress={handleSignUp} />
        <Button title="Log In" onPress={handleLogIn} />
      </View>

      <Text style={{ fontWeight: "600", marginBottom: 8 }}>Create Request</Text>

      <TextInput
        placeholder="Request title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Request details"
        value={details}
        onChangeText={setDetails}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      />

      <View style={{ marginBottom: 20 }}>
        <Button title="Create Request" onPress={handleCreateRequest} />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title={loading ? "Loading..." : "Refresh Open Requests"}
          onPress={loadRequests}
        />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>{item.title}</Text>
            <Text style={{ marginTop: 4 }}>{item.details || "No details"}</Text>
            <Text style={{ marginTop: 4 }}>Status: {item.status}</Text>
            <View style={{ marginTop: 8 }}>
              <Button title="Claim" onPress={() => handleClaim(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No open requests yet.</Text>}
      />
    </SafeAreaView>
  );
}