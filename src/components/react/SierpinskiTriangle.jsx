import { useState } from "react";

const CUTOFF = 24;

const Triangle = ({ width }) => {
	return <div className="triangle" style={{ width }}></div>;
};

const SierpinskiTriangle = ({ size }) => {
	if (size <= CUTOFF) {
		return <Triangle width={size} />;
	}

	const half = size / 2;
	return (
		<div style={{ position: "relative", width: `${size}px`, height: `${size}px` }}>
			{/* Top triangle */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: "50%",
					transform: "translateX(-50%)",
				}}
			>
				<SierpinskiTriangle size={half} />
			</div>

			{/* Bottom triangles */}
			<div
				style={{
					position: "absolute",
					top: `${half}px`,
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<SierpinskiTriangle size={half} />
				<SierpinskiTriangle size={half} />
			</div>
		</div>
	);
};

export default function Sierpinski() {
	const [sizeMultiplier, setSizeMultiplier] = useState(1);

	// Map the multiplier to the corresponding size
	const size = 24 * Math.pow(2, sizeMultiplier);

	const handleChange = event => {
		setSizeMultiplier(parseInt(event.target.value));
	};

	return (
		<div>
			<select
				onChange={handleChange}
				style={{
					marginBottom: "16px",
				}}
				value={sizeMultiplier}
			>
				{[...Array(8).keys()].map(i => (
					<option key={i} value={i}>
						{i + 1} ({24 * Math.pow(2, i)} px)
					</option>
				))}
			</select>
			<SierpinskiTriangle size={size} />
		</div>
	);
}
