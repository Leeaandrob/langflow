import React, { forwardRef } from "react";
import SvgTela from "./Tela";

export const TelaIcon = forwardRef<SVGSVGElement, React.PropsWithChildren<{}>>(
  (props, ref) => {
    return <SvgTela ref={ref} {...props} />;
  },
);
