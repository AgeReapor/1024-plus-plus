import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolateColor,
} from "react-native-reanimated";
import { Button, Text } from "react-native";
import * as style from "./utils/StyleUtilClasses";
import { useState } from "react";

export default function App(props) {
	const [state, setState] = useState({
		x: 0,
		y: 0,
	});

	return (
		<Animated.View
			style={[
				style.flex_center,
				style.flex_row,
				style.gap(style.rem(0.5)),
			]}
		>
			<Button
				title="Change Position"
				onPress={() => {
					setState({
						x: Math.random() * 100,
						y: Math.random() * 100,
					});
				}}
			/>
			<Text>
				Position: {Math.round(state.x)}, {Math.round(state.y)}
			</Text>
		</Animated.View>
	);
}
