import * as React from "react";
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";
import { Button, ButtonContainer, Table } from "./styles";

export default function ListEmployee() {
  const navigate = useNavigate();
  const [usersPerPage] = React.useState(25);
  const [users, setUsers] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  const quantityPages = Math.ceil(users.length / usersPerPage);
  const firstUser = currentPage * usersPerPage;
  const lastUser = firstUser + usersPerPage;
  console.log("users", users);
  const currentUsers = users.slice(firstUser, lastUser);

  const userList = new UserService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      console.log("entrou");
      const request = await userList.getUsers();

      setUsers(request.data.listUsers);
    };
    fetchUsers();
  }, []);

  //Botão de atualizar
  const updateUser = async () => {
    navigate("/");
  };

  //Botão de deletar que chama um modal para uma segunda confirmação do delete
  const deleteModal = () => {
    setShowDeleteConfirmation(true);
  };

  //Botão do modal caso o usuário não queria deletar
  const hideDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  //Botão do modal para confirmação caso o usuário realmente queira deletar
  const confirmDelete = async () => {
    alert("Usuário deletado com sucesso!");

    hideDeleteModal();
    window.location.reload();
  };

  return (
    <div>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Perfil</th>
              <th>E-mail</th>
              <th>Setor</th>
              <th>Empresa</th>
              <th>Unidade</th>
              <th>Açôes</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.company}</td>
                  <td>{user.unit}</td>
                  <td>
                    <ButtonContainer>
                    <Button view>
                        <FaRegEye />
                      </Button>
                      <Button onClick={() => updateUser(user)}>
                        <FaRegEdit color="white"/>
                      </Button>
                      <Button delete onClick={() => deleteModal(user)}>
                        <FaRegTrashAlt color="white"/>
                      </Button>
                    </ButtonContainer>
                  </td>
                </tr>
              ))
            ) : (
              <h3>Nenhum usuário encontrado</h3>
            )}
          </tbody>
        </Table>
      </div>
      <div>
        {showDeleteConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <p>Deseja realmente excluir o usuário?</p>
              <button className="confirm" onClick={confirmDelete}>
                Sim
              </button>
              <button className="cancel" onClick={hideDeleteModal}>
                Não
              </button>
            </div>
          </div>
        )}
      </div>
      <footer>
        {Array.from(Array(quantityPages), (_item, index) => (
          <button
            className="button-footer"
            key={index}
            value={index}
            onClick={({ target }) => setCurrentPage(Number(target.value))}
          >
            {index + 1}
          </button>
        ))}
      </footer>
    </div>
  );
}
