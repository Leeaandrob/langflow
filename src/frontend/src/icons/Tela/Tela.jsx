const SvgTela = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    viewBox="0 0 512 512"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width={512} height={512} fill="#FFFFFF" rx={104.187} ry={105.042} />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="256"
      fill="#0000FF"
    >
      T
    </text>
  </svg>
);

export default SvgTela;
