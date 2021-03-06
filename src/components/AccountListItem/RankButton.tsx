import styled from "styled-components";
import LinkButton from "../LinkButton";

export default styled(LinkButton)`
  color: ${props => props.theme.colors.gray[8]};
  text-align: center;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;
