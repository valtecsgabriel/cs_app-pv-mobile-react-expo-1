import api from "../../axios_config";
import { ICommonResponse } from "../../interfaces/CS_ICommonResponse";
import { IReqInsertPaymentForm } from "../../interfaces/pagamento/CS_IReqInsertPaymentForm";
import { PaymentType } from "../../interfaces/pagamento/CS_IReqListFormPayment";
import { IResPaymentResponse } from "../../interfaces/pagamento/CS_IResListFormPayment";
import { IResFormPaymentComplete } from '../../interfaces/pagamento/CS_IResListFormPaymentComplete';
import { IResPaymentFormByIdComplete } from '../../interfaces/pagamento/CS_IResPaymentFormByIdComplete';
import { IResListPaymentFormSaved } from "../../interfaces/pagamento/IResListPaymentFormSaved";
import { TermItem } from './../../interfaces/pagamento/IResPaymentTerm';

export async function getListOfPaymentForm({ tenantId, paymentForm }: { tenantId: number, paymentForm: PaymentType }): Promise<IResPaymentResponse> {
    const base = `/cs_At_40_LogicoService/rest/CS_Basico_API/${tenantId}/`
    let url = ''

    if (paymentForm === PaymentType.DINHEIRO) {
        url = base + 'ListFormasPagamentoDinheiro'
    } else if (paymentForm === PaymentType.VALE_CREDITO) {
        url = base + 'ListFormasPagamentoValeCredito'
    } else if (paymentForm === PaymentType.VALE_PRESENTE) {
        url = base + 'ListFormasPagamentoValePresente'
    } else {
        url = base + 'ListFormasPagamentoAReceberAVista'
    }


    try {
        const response = await api.get(url)

        return response.data as IResPaymentResponse
    } catch (error) {
        throw error
    }
}

/** lista forma completa + condicao de pagamento */
export async function getPaymentFormByIdWithConditions({ tenantId, paymentFormKey }: { tenantId: number, paymentFormKey: string }):
    Promise<IResPaymentFormByIdComplete> {
    const url = `/CSR_BB100_Tabelas_LIB/rest/CS_TabelasTotalizacao/csicp_bb026_Get_FormaPagto`

    const headerParams = {
        tenant_id: tenantId
    }

    const searchParams = {
        in_bb026_id: paymentFormKey
    }
    try {
        const response = await api.get(url, { headers: headerParams, params: searchParams })
        //id da condicao fixa
        const condFixId = response.data.csicp_bb026.csicp_bb026.BB026_CondPagtoFixoID

        let iResPaymentFormComplete: IResPaymentFormByIdComplete = {
            formByIdWithConditions: undefined,
            formByIdWithFixConditions: undefined
        }
        //se houver condicao fixa
        if (condFixId !== undefined) {
            iResPaymentFormComplete = {
                formByIdWithFixConditions: response.data
            }
            //caso nao
        } else {
            iResPaymentFormComplete = {
                formByIdWithConditions: response.data
            }
        }
        return iResPaymentFormComplete
    } catch (error) {
        throw error
    }
}

/** unica condicao de pagamento */
export async function getPaymentTerm({ tenantId, termId, paymentFormKey }: { tenantId: number, termId: string, paymentFormKey: string }): Promise<TermItem> {
    const url = `/cs_At_40_LogicoService/rest/CS_Basico_API/${tenantId}/${termId}//${paymentFormKey}/GetCondicaoPagamento`


    try {
        const response = await api.get(url)
        return response.data as TermItem
    } catch (error) {
        throw error
    }
}

/** A NOVA API APONTA PRA ESSA FUNCAO */
export async function getListOfPaymentForm002({ tenantId }: { tenantId: number }): Promise<IResFormPaymentComplete> {
    const url = `/CSR_BB100_Tabelas_LIB/rest/CS_TabelasTotalizacao/csicp_bb026_Get_List_FormaPagto`
    const headerParams = {
        tenant_id: tenantId,
        In_IsCount: 0,
        In_IsActive: true,
        in_currentPage: 1,
        in_pageSize: 9999
    }


    try {
        const response = await api.get(url, { headers: headerParams })
        return response.data as IResFormPaymentComplete
    } catch (error) {
        throw error
    }
}


/** A NOVA API APONTA PRA ESSA FUNCAO */
export async function insertPaymentForm({ tenantId, pvId, insertPaymentBody }: { tenantId: number, pvId: string, insertPaymentBody: IReqInsertPaymentForm }):
    Promise<ICommonResponse> {
    const url = `/cs_At_40_LogicoService/rest/CS_PV_API/${tenantId}/${pvId}/Pagamento_InserirForma`

    const body = {
        FormaPagamentoId: insertPaymentBody.FormaPagamentoId,
        CondicaoPagamentoId: insertPaymentBody.CondicaoPagamentoId,
        FormaPagamentoEntradaId: insertPaymentBody.FormaPagamentoEntradaId,
        Valor: insertPaymentBody.Valor,
        ValorEntrada: insertPaymentBody.ValorEntrada,
        DadosChequePDV: insertPaymentBody.DadosChequePDV
    }

    try {
        const response = await api.post(url, body)
        return response.data as ICommonResponse
    } catch (error) {
        throw error
    }
}


/** A NOVA API APONTA PRA ESSA FUNCAO */
export async function listPaymentForm({ tenantId, pvId }: { tenantId: number, pvId: string }):
    Promise<IResListPaymentFormSaved> {
    const url = `/cs_At_40_LogicoService/rest/CS_PV_API/${tenantId}/${pvId}/Pagamento_ListarPagamentos`
    try {
        const response = await api.get(url)
        return response.data as IResListPaymentFormSaved
    } catch (error) {
        throw error
    }
}

/** A NOVA API APONTA PRA ESSA FUNCAO */
export async function deletePaymentForm({ tenantId, formaPgtoAtendimentoId }: { tenantId: number, formaPgtoAtendimentoId: string }):
    Promise<ICommonResponse> {
    const url = `/cs_At_40_LogicoService/rest/CS_PV_API/${tenantId}/Pagamento_DeleteVinculo/${formaPgtoAtendimentoId}`
    try {
        const response = await api.delete(url)
        return response.data as ICommonResponse
    } catch (error) {
        throw error
    }
}