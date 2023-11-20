const { default: styled } = require("styled-components");

export const ListGroup = styled.div``;

export const ListGroupItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.light};
`;

export default ListGroup;
