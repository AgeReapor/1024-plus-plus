import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	Easing,
	interpolate,
	interpolateColor,
	ReduceMotion,
	useAnimatedStyle,
	withTiming,
	withSpring,
	useSharedValue,
} from "react-native-reanimated";

export default function Tile({
	x,
	y,
	val,
	isAlive = true,
	size = 80,
	deathCB = () => {
		console.log("Tile died");
	},
}) {
	const scale = useSharedValue(0);
	let actionInProgress = false;

	// Pulse when value changes
	useEffect(() => {
		if (scale.value === 0) return;
		scale.value = 1.5;
		setTimeout(() => {
			scale.value = 1;
		}, 100);
	}, [val]);

	// on spawn, grow to full size
	useEffect(() => {
		scale.value = 1.2;
		setTimeout(() => {
			scale.value = 1;
		}, 100);
	}, []);

	useEffect(() => {
		if (isAlive) return;
		deathAnimation();
		setTimeout(() => {
			deathCB();
		}, 100);
	}, [isAlive]);

	const tileAnimStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: withTiming(
				interpolateColor(
					val,
					[0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
					tileColors
				)
			),
			transform: [
				{ translateX: withTiming(x, translateConfig) },
				{ translateY: withTiming(y, translateConfig) },
				{ scale: withSpring(scale.value, scaleConfig) },
			],
			width: size,
			height: size,
		};
	});

	const textAnimStyles = useAnimatedStyle(() => {
		return {
			color: interpolateColor(val, [0, 2, 4, 8], textColors),
			fontSize: interpolate(val, [16, 256, 1024, 2048], fontSizes),
		};
	});

	const deathAnimation = () => {
		scale.value = 0;
	};

	return (
		<Animated.View style={[sheet.tile, tileAnimStyles]}>
			<Animated.Text style={[sheet.text, textAnimStyles]}>
				{val}
			</Animated.Text>
		</Animated.View>
	);
}

const sheet = StyleSheet.create({
	tile: {
		borderRadius: 7,

		position: "absolute",
		justifyContent: "center",
		alignItems: "center",

		// Anchor center of the tile
		// marginLeft: -SIDE / 2,
		// marginTop: -SIDE / 2,
	},
	text: {
		fontFamily: "notoserif",
		fontWeight: "700",
	},
});

const tileColors = [
	"#cdc1b4", // ""
	"#eee4da", // 2
	"#ede0c8", // 4
	"#f2b179", // 8
	"#f59563", // 16
	"#f67c5f", // 32
	"#f65e3b", // 64
	"#edcf72", // 128
	"#edcc61", // 256
	"#edc850", // 512
	"#edc53f", // 1024
	"#3e3933", // 2048
];

const textColors = [
	"#00000000", // 0
	"#776e65", // 2 onwards
	"#776e65",
	"#f8f3ee", // 8 onwards
];

const fontSizes = [48, 40, 34, 34];

const translateConfig = {
	duration: 300,
	easing: Easing.inOut(Easing.quad),
	reduceMotion: ReduceMotion.System,
};

const scaleConfig = {
	duration: 100,
	reduceMotion: ReduceMotion.System,
};
