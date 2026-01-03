import { StyleSheet, Text, View } from "react-native";
// @ts-ignore
import SyntaxHighlighter from "react-native-syntax-highlighter";
// @ts-ignore
import { dracula } from "react-syntax-highlighter/styles/hljs";

type Props = {
  files: {
    filename: string;
    language: string;
    content: string;
  }[];
};

const CodeContent = ({ files }: Props) => {
  return files ? (
    <View>
      {files.map((file, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Text style={styles.title}>{file.filename}</Text>

          <SyntaxHighlighter
            language={file.language.toLowerCase()}
            style={dracula}
            highlighter={"hljs"}
          >
            {file.content}
          </SyntaxHighlighter>
        </View>
      ))}
    </View>
  ) : (
    <Text style={styles.title}>No file included</Text>
  );
};

export default CodeContent;

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20,
    color: "white",
  },
});
