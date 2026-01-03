import { Ionicons } from "@expo/vector-icons";
import { Icon, Text } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import color from "@/config/color";

interface IconConfig {
  type?: string;
  name: string;
}

interface SideConfig {
  icon: IconConfig;
  handle: () => void;
  disabled?: boolean;
}

interface HeaderBarProps {
  left?: SideConfig;
  right?: SideConfig;
  title: string;
  style?: ViewStyle;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ left, right, title, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Left icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={left?.handle}
        disabled={!left || left.disabled}
      >
        {left ? (
          <Icon as={Ionicons} name={left.icon.name} size="md" color="white" />
        ) : null}
      </TouchableOpacity>

      {/* Body */}
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.text}>
          {title}
        </Text>
      </View>

      {/* Right icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={right?.handle}
        disabled={!right || right.disabled}
      >
        {right ? (
          <Icon as={Ionicons} name={right.icon.name} size="md" color="white" />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    backgroundColor: color.DARK_PRIMARY,
  },

  iconContainer: {
    flex: 1,
    minWidth: 50,
    maxWidth: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: "white",
    fontSize: 20,
  },

  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  text: {
    color: "white",
    fontSize: 16,
  },
});
