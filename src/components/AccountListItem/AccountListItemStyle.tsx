import styled from "styled-components";
import { Box } from "@primer/components";
import ButtonShownOnHover from "./ButtonShownOnHover";

export default styled(Box).attrs({
  as: "li",
  p: 3
})`
  & + & {
    border-top: 1px solid ${props => props.theme.colors.gray[3]};
  }

  &:hover ${ButtonShownOnHover} {
    visibility: visible;
  }
`;