import styled from "styled-components";

export const Table = styled.table`
border-collapse: collapse;
width: 780px;
overflow-x: auto;
margin-top: 12px;

th, td {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 15px;
}

th {
  font-size: 23px;
}

thead tr {
  background-color: rgb(151, 150, 150);
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
}

tbody tr:nth-child(odd) {
  background-color: white;
}

tbody tr:nth-child(even) {
  background-color: rgb(209, 209, 209);
}
`

export const ButtonContainer = styled.div`
display: flex;
gap: 10px;
`;

export const ButtonStyle = styled.button`
background-color: ${props => props.delete ? 'red' : (props.view ? 'yellow' : 'blue')};
border-radius: 50%;
border: 1px solid black;
color: black;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
padding: 0;

&:hover {
  background-color: ${props => props.delete ? 'darkred' : (props.view ? 'gold' : 'darkblue')};
}
`;