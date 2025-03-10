import styled from "styled-components";

export default function LoadingIndicator() {
  return (
    <Container>
      <div className="circle" />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  background-color: black;

  .circle {
    border: 2px solid #333;
    border-radius: 50%;
    position: relative;
    width: 25px;
    height: 25px;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 500ms infinite linear;

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
`;
