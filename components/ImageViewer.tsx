import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import color from "@/config/color";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;

interface ImageViewerProps {
  uri: string;
  visible: boolean;
  close: () => void;
}

// Full-screen image with pinch-to-zoom, pan while zoomed and double-tap zoom.
// Shared values use get()/set() because the React Compiler is enabled.
const ImageViewer: React.FC<ImageViewerProps> = ({ uri, visible, close }) => {
  const { width, height } = useWindowDimensions();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  // Pinch focal point in image coordinates (relative to the screen center)
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);

  // Keep the zoomed image covering the screen instead of drifting off it
  const clamp = (value: number, s: number, size: number) => {
    "worklet";
    const max = Math.max(0, (size * s - size) / 2);
    return Math.min(max, Math.max(-max, value));
  };

  const animateTo = (targetScale: number, targetX: number, targetY: number) => {
    "worklet";
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale));
    const x = clamp(targetX, s, width);
    const y = clamp(targetY, s, height);
    scale.set(withTiming(s));
    translateX.set(withTiming(x));
    translateY.set(withTiming(y));
    savedScale.set(s);
    savedTranslateX.set(x);
    savedTranslateY.set(y);
  };

  const settle = () => {
    "worklet";
    animateTo(scale.get(), translateX.get(), translateY.get());
  };

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      const fx = e.focalX - width / 2;
      const fy = e.focalY - height / 2;
      originX.set((fx - translateX.get()) / scale.get());
      originY.set((fy - translateY.get()) / scale.get());
    })
    .onUpdate((e) => {
      const s = Math.min(
        MAX_SCALE * 1.5,
        Math.max(MIN_SCALE * 0.5, savedScale.get() * e.scale),
      );
      // Keep the point under the fingers under the fingers
      scale.set(s);
      translateX.set(e.focalX - width / 2 - originX.get() * s);
      translateY.set(e.focalY - height / 2 - originY.get() * s);
    })
    .onEnd(() => {
      settle();
    });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      translateX.set(savedTranslateX.get() + e.translationX);
      translateY.set(savedTranslateY.get() + e.translationY);
    })
    .onEnd(() => {
      settle();
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (savedScale.get() > MIN_SCALE) {
        animateTo(MIN_SCALE, 0, 0);
      } else {
        // Zoom in around the tapped point
        const fx = e.x - width / 2;
        const fy = e.y - height / 2;
        animateTo(
          DOUBLE_TAP_SCALE,
          fx - fx * DOUBLE_TAP_SCALE,
          fy - fy * DOUBLE_TAP_SCALE,
        );
      }
    });

  const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.get() },
      { translateY: translateY.get() },
      { scale: scale.get() },
    ],
  }));

  return (
    <Modal
      visible={visible}
      onRequestClose={close}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* Modals render in their own native window, so they need their own root */}
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.container}>
            <Animated.Image
              style={[{ width, height }, imageStyle]}
              resizeMode="contain"
              source={{ uri }}
            />
          </Animated.View>
        </GestureDetector>

        <TouchableOpacity style={styles.closeButton} onPress={close}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DARK_PRIMARY,
  },
  closeButton: {
    position: "absolute",
    top: 48,
    right: 16,
    padding: 8,
    borderRadius: 24,
    backgroundColor: color.DARK_SECONDARY,
  },
});

export default ImageViewer;
