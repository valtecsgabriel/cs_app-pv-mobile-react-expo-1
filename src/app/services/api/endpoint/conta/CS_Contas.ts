import api from "../../axios_config";
import { ICommonReq } from "../../interfaces/CS_ICommonResponse";
import { IResBBEstatica } from "../../interfaces/IResBBEstatica";
import { IReqSave1201 } from "../../interfaces/contas/CS_IReqSave1201";
import { CS_IReqSave1202 } from "../../interfaces/contas/CS_IReqSave1202";
import { IReqSaveConta } from "../../interfaces/contas/CS_IReqSaveConta";
import { CS_IReqSaveEndereco } from "../../interfaces/contas/CS_IReqSaveEndereco";
import { CS_IResGetConta } from "../../interfaces/contas/CS_IResGetConta";
import { IResGetContaById } from "../../interfaces/contas/CS_IResGetContaById";
import { IResGetListConta } from "../../interfaces/contas/CS_IResGetListConta";
import { IResPadraoConta } from "./IResPadraoConta";

export async function getContaById({ cs_tenant_id, cs_conta_id }: { cs_tenant_id: number, cs_conta_id: string }): Promise<IResGetContaById> {
    try {
        const data = {
            Tenant_id: cs_tenant_id,
            In_BB012_ID: cs_conta_id
        }

        const response = await api.get('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb012_Get_Conta', { params: data });

        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function saveConta({ cs_tenant_id, cs_save_conta }: { cs_tenant_id: number, cs_save_conta: IReqSaveConta }): Promise<IResPadraoConta> {
    try {
        const data = {
            Tenant_id: cs_tenant_id
        }
        const response = await api.post('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb012_Save_Conta', cs_save_conta, { params: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function getListConta({ commonReq, cs_mod_relacao_id }: { commonReq: ICommonReq, cs_mod_relacao_id: number }): Promise<IResGetListConta> {
    try {
        const data = {
            Tenant_id: commonReq.Tenant_id,
            In_IsActive: commonReq.In_IsActive,
            In_IsCount: commonReq.In_IsCount,
            in_currentPage: commonReq.in_currentPage,
            in_pageSize: commonReq.in_pageSize,
            In_ModRelacaoID: cs_mod_relacao_id,
            in_search: commonReq.in_search
        }

        const response = await api.get('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb012_Get_List_ContasCompleto', { headers: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function getConta({ cs_tenant_id, cs_conta_id }: { cs_tenant_id: number, cs_conta_id: string }): Promise<CS_IResGetConta> {
    try {
        const urlParams = {
            Tenant_id: cs_tenant_id,
            In_BB012_ID: cs_conta_id
        }
        const response = await api.get('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb012_Get_Conta', { params: urlParams });
        return response.data;
    } catch (err) {
        throw err;
    }
}



export async function deleteConta({ cs_tenant_id, cs_conta_id }: { cs_tenant_id: number, cs_conta_id: string }) {
    try {
        const data = {
            Tenant_id: cs_tenant_id,
            In_BB012_ID: cs_conta_id
        }

        const response = await api.delete('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb012_Delete_Conta', { params: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}


export async function save1201({ cs_tenant_id, cs_req_save }: { cs_tenant_id: number, cs_req_save: IReqSave1201 }) {
    try {
        const data = {
            Tenant_id: cs_tenant_id
        }
        const response = await api.post('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb01201_Save', cs_req_save, { headers: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function save1202({ cs_tenant_id, cs_req_save }: { cs_tenant_id: number, cs_req_save: CS_IReqSave1202 }) {
    try {
        const data = {
            Tenant_id: cs_tenant_id
        }
        const response = await api.post('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb01202_Save', cs_req_save, { headers: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}


export async function save1206({ cs_tenant_id, cs_req_save }: { cs_tenant_id: number, cs_req_save: CS_IReqSaveEndereco }) {
    try {
        const data = {
            Tenant_id: cs_tenant_id
        }
        const response = await api.post('/CSR_BB100_ClienteFor_IS/rest/CS_Contas/csicp_bb01206_Save_Update', cs_req_save, { headers: data });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export async function get_csicp_bbs(): Promise<IResBBEstatica> {
    const url = `/CSR_BB100_Tabelas_LIB/rest/GetAllEstatica/get_all_bb`
    try {
        const response = await api.get(url)
        return response.data as IResBBEstatica
    } catch (error) {
        throw error
    }
}