import styled from 'styled-components';

export const Container = styled.div`
  max-width: 980px;
  margin: 10px auto;

  display: flex;
  flex-direction: column;
`;

export const InputContainer1 = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  div:nth-child(1) {
    width: 520px;
  }

  div:nth-child(2) {
    width: 150px;
  }

  div:nth-child(3) {
    width: 140px;
  }
`;

export const InputContainer2 = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  div {
    width: 270px;
  }
`;
