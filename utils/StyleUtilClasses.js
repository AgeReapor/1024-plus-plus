const REM_IN_PX = 16;

export const px2rem = (px) => {
	return px / REM_IN_PX;
};

export const flex = {
	flex: 1,
};

export const flex_center = {
	alignItems: "center",
	justifyContent: "center",
};

export const flex_row = {
	flexDirection: "row",
};

export const gap = (rem = 0.5) => {
	return {
		gap: rem * REM_IN_PX,
	};
};

export const justifyContent = (justifyContent = "center") => {
	return {
		justifyContent: justifyContent,
	};
};

export const alignItems = (alignItems = "center") => {
	return {
		alignItems: alignItems,
	};
};

export const width = (rem) => {
	return {
		width: rem * REM_IN_PX,
	};
};

export const height = (rem) => {
	return {
		height: rem * REM_IN_PX,
	};
};

export const bgColor = (color = "#fff") => {
	return {
		backgroundColor: color,
	};
};
