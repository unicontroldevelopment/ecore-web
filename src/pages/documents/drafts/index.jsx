import { Button, Modal } from "antd";
import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import DraftForm from "../../../components/DraftForm";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";
import DraftsService from "../../../services/Drafts";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Drafts() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState({});
  const [drafts, setDrafts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const draftService = new DraftsService();
  const contractService = new DocumentsService();

  useEffect(() => {
    fetchContractAndDrafts();
  }, [id]);

  const fetchContractAndDrafts = async () => {
    setLoading(true);
    try {
      const [contractResponse, draftsResponse] = await Promise.all([
        contractService.getById(id),
        draftService.getDraftsByContractId(id),
      ]);

      const { user } = contractResponse.data;

      setContract(user);

      const updatedDrafts = draftsResponse.map((draft) => ({
        ...draft,
        date: formatDate(draft.date),
      }));
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error("Erro ao buscar contrato e minutas:", error);
      Toast.Error("Falha ao carregar contrato e minutas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDraft(null);
    setIsModalVisible(true);
  };

  const handleEdit = async (draft) => {
    const {  draft_file, ...draftData } = draft;

    setSelectedDraft(draftData);
    setIsModalVisible(true)
    return;
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (selectedDraft) {
        await draftService.updateDraft(selectedDraft.id, formData);
        Toast.Success("Minuta atualizada com sucesso");
      } else {
        await draftService.createDraft(formData);
        Toast.Success("Minuta criada com sucesso");
      }

      setIsModalVisible(false);
      await fetchContractAndDrafts();
    } catch (error) {
      console.error("Erro ao salvar minuta:", error);
      Toast.Error("Falha ao salvar minuta");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (draft) => {
    try {
      const fileData = draft.DraftFile[0]?.file?.data;
      if (!fileData) {
        throw new Error("O arquivo não está disponível ou está mal formatado.");
      }

      const pdfData = Array.isArray(fileData)
        ? new Uint8Array(fileData)
        : fileData;

      const createdPDFDoc = await PDFDocument.load(pdfData);

      const mergedPDF = await PDFDocument.create();
      mergedPDF.setTitle(`Minuta - ${contract.name}`);

      for (const pageNum of createdPDFDoc.getPageIndices()) {
        const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
        mergedPDF.addPage(page);
      }

      const mergedPdfBytes = await mergedPDF.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Erro ao visualizar minuta:", error);
      Toast.Error("Falha ao visualizar minuta: " + error.message);
    }
  };

  const handleUpdate = () => {
    return;
  };

  const confirmDelete = async (draftId) => {
    try {
      await draftService.deleteDraft(draftId.id);
      Toast.Success("Minuta excluída com sucesso");
      fetchContractAndDrafts();
    } catch (error) {
      console.error("Erro ao excluir minuta:", error);
      Toast.Error("Falha ao excluir minuta");
    }
  };

  const cancelDelete = () => {
    return;
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (value) => {
        const formatter = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return formatter.format(value / 100);
      },
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div>
      {loading && <Loading />}
      <Table.Root title={`Minutas de ${contract.name}`}>
        <Button
          type="primary"
          onClick={() => handleCreate()}
          style={{ marginLeft: "90%", marginBottom: "20px" }}
        >
          Criar Minuta
        </Button>
        <Table.Table
          data={drafts}
          columns={columns}
          onView={handleView}
          onUpdate={handleEdit}
          confirm={confirmDelete}
          cancel={cancelDelete}
        />

        <Modal
          title={selectedDraft ? "Editar Minuta" : "Nova Minuta"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedDraft(null);
          }}
          footer={null}
        >
          {isModalVisible && (
            <DraftForm
              draft={selectedDraft}
              onSubmit={handleSubmit}
              contractId={id}
            />
          )}
        </Modal>
      </Table.Root>
    </div>
  );
}
