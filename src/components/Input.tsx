import { TextInput, TextInputProps } from "react-native";

import { colors } from "@/theme/colors";

export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.customGray[400]}
      className="w-full h-14 bg-white border border-blue-500 rounded p-4 text-black font-regular text-base"
      {...rest}
    />
  );
}
