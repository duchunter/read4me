import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  DrawerLayoutAndroid,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { pick, types } from "@react-native-documents/picker";
import { File } from "expo-file-system";
import * as Speech from "expo-speech";

import CodeContent from "@/components/CodeContent";
import DrawerContent from "@/components/DrawerContent";
import HeaderBar from "@/components/HeaderBar";
import ImgContent from "@/components/ImgContent";
import PlayControl from "@/components/PlayControl";
import SeekBar from "@/components/SeekBar";
import TextContent from "@/components/TextContent";

import color from "@/config/color";
import { TTS_LANGUAGE, WIDTH } from "@/config/constants";
import { transformMediumPost, transformTextFile } from "@/utils/transformer";

// expo-speech on Android passes `language` to `new Locale(...)`, which only
// understands a bare language code ("vi"), not a full tag ("vi-VN")
const speechLanguage = (locale: string) => locale.split("-")[0];

export default function Index() {
  const [data, setData] = useState<{ img?: any; files?: any; text: string }[]>([
    {
      text: "",
    },
  ]);
  const [file, setFile] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMode, setPlayingMode] = useState(0);
  const [docMode, setDocMode] = useState("TEXT");
  const [display, setDisplay] = useState("text");
  const [language, setLanguage] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  // Applies from the next segment, so changing it doesn't restart playback
  const rateRef = useRef(1);

  const pickFile = async () => {
    try {
      const result = await pick({
        type: [types.allFiles],
      });

      const res = result[0];
      if (
        !res ||
        !res.name ||
        (!res.name.endsWith(".txt") && !res.name.endsWith(".json"))
      ) {
        return;
      }

      setFile(res.name);
      const buffer = await new File(res.uri).text();

      let newData;
      switch (docMode) {
        case "TEXT":
          newData = transformTextFile(buffer);
          break;

        case "MEDIUM_POST":
          newData = transformMediumPost(buffer);
          break;

        default:
          throw new Error(`Unknown document mode: ${docMode}`);
      }

      newData.unshift({});
      setData(newData);
      setCurrentIndex(0);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const changeLanguage = async (newLanguage: number) => {
    const { label, locale } = TTS_LANGUAGE[newLanguage];
    const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
    const lang = speechLanguage(locale);
    if (!voices.some((voice) => speechLanguage(voice.language) === lang)) {
      Alert.alert(
        "Voice not available",
        `Install the ${label} (${locale}) voice in Android Settings > Text-to-speech output, then try again.`,
      );
      return;
    }

    // Stop the current segment; the playback effect re-speaks it in the new voice
    Speech.stop();
    setLanguage(newLanguage);
  };

  const speak = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    if (data.length === 1) {
      return;
    }

    if (currentIndex === data.length) {
      if (playingMode === 2) {
        return;
      }

      setCurrentIndex(0);
    }

    const next = data[currentIndex];

    if (next) {
      const say = (text: string) =>
        Speech.speak(text, {
          language: speechLanguage(TTS_LANGUAGE[language].locale),
          rate: rateRef.current,
          onDone: () => setCurrentIndex((prevIndex) => prevIndex + 1),
        });

      if (next.img) {
        say(TTS_LANGUAGE[language].picturePrompt);
        setDisplay("img");
        return;
      }

      if (next.files) {
        say(TTS_LANGUAGE[language].codePrompt);
        setDisplay("code");
        return;
      }

      setDisplay("text");
      say(next.text || "");
    }
  }, [currentIndex, data, isPlaying, language, playingMode]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      speak();
    }
  }, [currentIndex, isPlaying, speak]);

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={Math.min(WIDTH * 0.75, 300)}
      drawerPosition={"left"}
      renderNavigationView={() => (
        <DrawerContent
          currentMode={docMode}
          close={() => drawerRef.current?.closeDrawer()}
          changeMode={(mode) => setDocMode(mode)}
        />
      )}
      style={{
        flex: 1,
        backgroundColor: color.DARK_PRIMARY,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          paddingBottom: 40,
        }}
      >
        <StatusBar backgroundColor={color.DARK_PRIMARY} />
        <HeaderBar
          title={file || "No file selected"}
          left={{
            icon: {
              name: "menu",
            },
            handle: () => drawerRef.current?.openDrawer(),
          }}
          right={{
            icon: {
              name: "folder",
            },
            handle: pickFile,
          }}
        />

        <View style={styles.container}>
          <ScrollView bounces={false}>
            {display === "text" && (
              <TextContent
                text={data[currentIndex] && data[currentIndex].text}
                next={data[currentIndex + 1]}
              />
            )}

            {display === "img" && <ImgContent uri={data[currentIndex].img} />}

            {display === "code" && (
              <CodeContent files={data[currentIndex].files} />
            )}
          </ScrollView>
        </View>

        <SeekBar
          disabled={!data.length}
          max={data.length}
          value={currentIndex}
          pause={() => {
            Speech.stop();
            setIsPlaying(false);
          }}
          setValue={(value) => {
            setCurrentIndex(Math.floor(value));
            setIsPlaying(true);
          }}
        />

        <PlayControl
          isPlaying={isPlaying}
          forward={() => {
            Speech.stop();
            if (currentIndex >= data.length - 6) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex((prevIndex) => prevIndex + 5);
            }
          }}
          backward={() => {
            Speech.stop();
            if (currentIndex <= 5) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex((prevIndex) => prevIndex - 5);
            }
          }}
          play={() => {
            setIsPlaying(true);
          }}
          pause={() => {
            Speech.stop();
            if (currentIndex > 0) setCurrentIndex((prevIndex) => prevIndex - 1);
            setIsPlaying(false);
          }}
          setSpeed={(val) => {
            rateRef.current = val;
          }}
          setMode={(mode) => {
            setPlayingMode(mode);
          }}
          language={language}
          setLanguage={changeLanguage}
        />
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DARK_PRIMARY,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
});
