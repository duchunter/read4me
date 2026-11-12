import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import color from "@/config/color";
import { DOC_MODE } from "@/config/constants";

interface DrawerContentProps {
  currentMode: string;
  close: () => void;
  changeMode: (mode: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  currentMode,
  close,
  changeMode,
}) => {
  const insets = useSafeAreaInsets();

  const parseTitle = (text: string): string => {
    let title = text.toLowerCase().split("_").join(" ");
    return title[0].toUpperCase() + title.slice(1);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
      }}
    >
      <Text style={styles.title}>Mode:</Text>

      {DOC_MODE.map((mode) => (
        <Text
          key={mode}
          onPress={() => {
            if (currentMode !== mode) {
              changeMode(mode);
            }
            close();
          }}
          style={[
            styles.text,
            {
              color: currentMode === mode ? color.BLUE_PRIMARY : "white",
            },
          ]}
        >
          {parseTitle(mode)}
        </Text>
      ))}
    </ScrollView>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: color.DARK_SECONDARY,
  },

  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    color: "white",
  },

  text: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
});
