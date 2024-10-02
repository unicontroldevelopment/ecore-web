import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const EditBtn = ({id}) => {
  const navigate = useNavigate("/form")
  return (
    <Button
    className="w-[200px]"
    onClick={() => navigate(`/formEdit/${id}`)}
  >
    Editar
  </Button>
  )
}

export default EditBtn