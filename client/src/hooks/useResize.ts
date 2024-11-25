import { useCallback, useEffect, useState } from "react";

export const useResize = () => {
	const [windowSize, setWindowSize] = useState(window.innerWidth);

	const handleWindowResize = useCallback(() => {
		setWindowSize(window.innerWidth);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [handleWindowResize, windowSize]);

	return windowSize;
};
