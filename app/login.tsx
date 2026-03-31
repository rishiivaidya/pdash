import { router } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { logIn } from "../lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await logIn(email, password);
      alert("Logged in");
      router.replace("/feed");
    } catch (error: any) {
      alert(error?.message || "Login failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        Login
      </Text>

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

      <Button title="Log In" onPress={handleLogin} />

      <View style={{ marginTop: 10 }}>
        <Button title="Go to Sign Up" onPress={() => router.push("/signup")} />
      </View>
    </SafeAreaView>
  );
}
