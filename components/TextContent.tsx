import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NextContent {
  files?: any;
  img?: string;
  text?: string;
}

interface TextContentProps {
  text: string;
  next?: NextContent;
}

const TextContent: React.FC<TextContentProps> = ({ text, next }) => {
  const getNextText = (): string => {
    if (!next) {
      return "End of file";
    }

    if (next.files) {
      return "(Some code)";
    }

    if (next.img) {
      return "(Image)";
    }

    return next.text || "";
  };

  return (
    <View>
      <Text style={styles.text}>{text}</Text>

      <Text style={styles.text}>{"\n\nNext: " + getNextText()}</Text>
    </View>
  );
};

export default TextContent;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 20,
    color: "white",
  },
});
