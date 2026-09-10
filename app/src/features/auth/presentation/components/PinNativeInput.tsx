import { ReactNode, useRef } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

interface PinNativeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  pinLength: number;
  editable?: boolean;
  children: ReactNode;
}

export function PinNativeInput({
  value,
  onChangeText,
  pinLength,
  editable = true,
  children,
}: PinNativeInputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <>
      <Pressable onPress={() => inputRef.current?.focus()}>{children}</Pressable>
      <TextInput
        ref={inputRef}
        testID="pin-native-input"
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={pinLength}
        editable={editable}
        autoFocus
        caretHidden
        style={styles.hiddenInput}
      />
    </>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
