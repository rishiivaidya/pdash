import { router } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { signUp } from "../lib/auth";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"requester" | "helper">("requester");

  async function handleSignup() {
    try {
      await signUp(name, email, password, role);
      alert("Signed up");
      router.replace("/");
    } catch (error: any) {
      alert(error?.message || "Signup failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Sign Up
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Text style={{ marginBottom: 10 }}>Select Role:</Text>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Button title="Requester" onPress={() => setRole("requester")} />
        <View style={{ width: 10 }} />
        <Button title="Helper" onPress={() => setRole("helper")} />
      </View>

      <Text style={{ marginBottom: 20 }}>Current role: {role}</Text>

      <Button title="Sign Up" onPress={handleSignup} />

      <View style={{ marginTop: 10 }}>
        <Button title="Go to Login" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
}