import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import ImageViewer from "@/components/ImageViewer";
import color from "@/config/color";

interface ImgContentProps {
  uri?: string;
}

const ImgContent: React.FC<ImgContentProps> = ({ uri }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!uri) {
    return <Text style={styles.text}>No URL specified</Text>;
  }

  return (
    <>
      <Pressable onPress={() => setViewerOpen(true)}>
        <Image style={styles.image} resizeMode={"contain"} source={{ uri }} />
        <View style={styles.zoomHint}>
          <Ionicons name="expand" size={18} color="white" />
        </View>
      </Pressable>

      {/* Mounted only while open so every opening starts unzoomed */}
      {viewerOpen && (
        <ImageViewer uri={uri} visible close={() => setViewerOpen(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
  zoomHint: {
    position: "absolute",
    right: 8,
    bottom: 8,
    padding: 6,
    borderRadius: 16,
    backgroundColor: color.DARK_SECONDARY,
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    color: "white",
  },
});

export default ImgContent;
