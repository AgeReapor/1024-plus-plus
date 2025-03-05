const REM_IN_PX = 16;

export const rem = (rem) => {
	return rem * REM_IN_PX;
};

export const flex_center = {
	flex: 1,
	alignItems: "center",
	justifyContent: "center",
};

export const flex_row = {
	flex: 1,
	flexDirection: "row",
};

export const gap = (gap) => {
	return {
		gap: gap,
	};
};
