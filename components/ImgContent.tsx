import React from "react";
import { Image, StyleSheet, Text } from "react-native";

interface ImgContentProps {
  uri?: string;
}

const ImgContent: React.FC<ImgContentProps> = ({ uri }) => {
  return uri ? (
    <Image style={styles.image} resizeMode={"contain"} source={{ uri }} />
  ) : (
    <Text style={styles.text}>No URL specified</Text>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    color: "white",
  },
});

export default ImgContent;
