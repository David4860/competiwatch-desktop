import { theme as primer } from "@primer/components";
import { colors } from "@primer/primitives";

const darkTheme = {
  backgroundColor: '#24292e',
  color: '#e1e4e8',
  linkColor: colors.blue[3]
};

const lightTheme = {
  linkColor: colors.blue[5]
};

export default function(themeName: string) {
  if (themeName === "dark") {
    return Object.assign({}, primer, darkTheme);
  }

  return Object.assign({}, primer, lightTheme);
};
