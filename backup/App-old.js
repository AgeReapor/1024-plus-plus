import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolateColor,
} from "react-native-reanimated";
import { Button, Text } from "react-native";

export default function AnimatedStyleUpdateExample(props) {
	const randomWidth = useSharedValue(10);

	const config = {
		duration: 500,
		easing: Easing.bezier(0.5, 0.01, 0, 1),
	};

	const style = useAnimatedStyle(() => {
		return {
			width: withTiming(randomWidth.value, config),
			backgroundColor: withTiming(
				interpolateColor(
					randomWidth.value,
					[0, 175, 350],
					["#38ACDD", "#44DE37", "#FFD61E"],
					"HSV"
				),
				config
			),
		};
	});

	return (
		<Animated.View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
			}}
		>
			<Animated.View
				style={[
					{
						width: 100,
						height: 80,
						margin: 30,
						justifyContent: "center",
						alignItems: "center",
					},
					style,
				]}
			>
				<Text>hello</Text>
			</Animated.View>
			<Button
				title="toggle"
				onPress={() => {
					randomWidth.value = Math.random() * 350;
				}}
			/>
		</Animated.View>
	);
}
