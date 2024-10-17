import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const EditBtn = ({id}) => {
  const navigate = useNavigate("/form")
  return (
    <Button
    className="flex justify-start gap-2 text-xs font-semibold"
    onClick={() => navigate(`/formEdit/${id}`)}
  >
    <FaEdit className="h-4 w-4"/>
    Editar
  </Button>
  )
}

export default EditBtn;