import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../services/AuthService";

const Home = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    console.log("Logout button pressed");
    await logout();
    setUser(null);
    console.log("User set to null, navigating to login");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome home, {user?.first_name} {user?.last_name}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Home; 