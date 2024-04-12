import { forwardRef } from "react";
import { Text, View } from "react-native";
import Bottom from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

type BottomSheetProps = {
  title: string;
  snapPoints: number[];
  children: React.ReactNode;
  onClose: () => void;
};
export const BottomSheet = forwardRef<Bottom, BottomSheetProps>(
  ({ title, snapPoints, children, onClose }, ref) => {
    return (
      <Bottom
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: colors.skyBlue[100],
          backgroundColor: colors.backgroundApp,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.white,
          marginTop: 5,
        }}
      >
        <View className="p-8 gap-4">
          <View className="flex-row">
            <Text className="flex-1 text-white font-semiBold text-base">
              {title}
            </Text>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.white}
              onPress={onClose}
            />
          </View>
          {children}
        </View>
      </Bottom>
    );
  }
);
