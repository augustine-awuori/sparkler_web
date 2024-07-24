import styled from "styled-components";

const Badge = ({ count }: { count: number }) => {
  return (
    <Container className="btn--icon">
      <span className="notifications-count">{count}</span>;
    </Container>
  );
};

const Container = styled.div`
  .btn--icon {
    margin-right: 15px;
    height: var(--icon-size);
    width: var(--icon-size);

    position: relative;
    .notifications-count {
      position: absolute;
      font-size: 11px;
      background-color: var(--theme-color);
      top: -5px;
      padding: 1px 5px;
      border-radius: 10px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: max-content;
    }
  }
`;

export default Badge;
