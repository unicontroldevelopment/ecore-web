import { useCallback, useEffect, useState } from 'react';
import D4SignService from '../services/D4SignService';
import DocumentsService from '../services/DocumentsService';
import { formatMoney } from '../utils/contractUtils';

const useContracts = () => {
  const [allContracts, setAllContracts] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    name: "",
    d4sign: "",
    franchise: "",
    type: "Contrato",
  });

  const service = new DocumentsService();
  const d4SignService = new D4SignService();

  const fetchContracts = useCallback(async (nameFilter = "", isLoadingControlled = false) => {
    if (isLoadingControlled) setLoading(true);
    try {
      const [contractsResponse, d4SignResponse] = await Promise.all([
        service.getContracts(nameFilter, filter.type),
        d4SignService.getAllContracts()
      ]);

      const dataContracts = contractsResponse.data.listContracts;
      const d4SignContracts = d4SignResponse.data;

      const d4SignDocsMap = new Map(
        d4SignContracts.map(doc => [doc.uuidDoc, doc])
      );

      const updatedContracts = dataContracts.map(contract => {
        const d4SignDoc = d4SignDocsMap.get(contract.d4sign) || null;

        return {
          ...contract,
          value: formatMoney(contract.value),
          d4SignData: d4SignDoc,
          clauses: contract.clauses.map((clause, index) => ({
            ...clause,
            currentId: index,
            isExpanded: false,
          })),
        };
      });

      setAllContracts(updatedContracts);
      setContracts(updatedContracts);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
    } finally {
      if (isLoadingControlled) setLoading(false);
    }
  }, [filter.type]);

  const applyFilters = useCallback((contracts, filters) => {
    return contracts.filter((contract) => {
      const nameMatch = contract.name.toLowerCase().includes(filters.name.toLowerCase());
      const franchiseMatch = contract.signOnContract && contract.signOnContract.some(
        (signature) => signature.Contract_Signature && signature.Contract_Signature.socialReason &&
        signature.Contract_Signature.socialReason.toLowerCase().includes(filters.franchise.toLowerCase())
      );
      let d4signMatch = true;
      if (filters.d4sign === "NÃO CADASTRADO") {
        d4signMatch = !contract.d4SignData;
      } else if (filters.d4sign) {
        d4signMatch = contract.d4SignData && contract.d4SignData.statusName.toLowerCase() === filters.d4sign.toLowerCase();
      }
      return nameMatch && (filters.franchise ? franchiseMatch : true) && d4signMatch;
    });
  }, []);

  useEffect(() => {
    const filteredContracts = applyFilters(allContracts, filter);
    setContracts(filteredContracts);
  }, [filter, allContracts, applyFilters]);

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  return { 
    allContracts, 
    contracts, 
    loading, 
    filter, 
    fetchContracts, 
    handleChangeFilter 
  };
};

export default useContracts;