/** INSERT PV WITHOUT SERVICE */
export interface IInsertPvWhitoutService {
    cs_tenant_id: number,
    cs_empresa_id: string,
    cs_usuario_id: string,
    cs_atendimento?: string
    cs_conta_id?: string,
    cs_quantidade: number,
    cs_codigo_produto: string,
    cs_entrega: boolean,

    /**
     * Tipos possiveis:
        1 - PreVenda
        2 - Cotacao
        3 - PV
        4 - DAV
        5 - Pedido
        6 - Contrato
        7 - Especial
        8 - Voucher
        9 - PDV Web
        10- Venda On-line
     */
    cs_tipo_atendimento: number
}

/** INSERT PV RESPONSE */
export interface IInsertPvResponse {
    IsOk: boolean,
    Msg: string,
    Key: string,
    Model: {
        AtendimentoId: string,
        AtendimentoProdutoId: string
    }
}

export interface ICommonResponse {
    IsOk: boolean,
    Msg: string,
    Key?: string,
}




/**GET PV */
export interface IGetPreVendaList {
    cs_tenant_id: number,
    cs_empresa_id: string,
    cs_usuario_id: string,
    cs_situacao_id?: number,
    cs_data_inicial: string,
    cs_data_final: string,
    cs_pesquisa?: string
}


/**RES PV LIST*/
export interface IResPreVenda {
    IsOk: boolean,
    Msg: string,
    List: IPreVendaItemListModel[]
}


/** RES PV MODEL LISTA*/
export interface IPreVendaItemListModel {
    ID: string;
    ProtocolNumber: string;
    Data_Emissao: string;
    DataValidade: string;
    Codigo: string;
    Nome_Cliente: string;
    Codigo_ContaReal: string;
    Situacao: string;
    Estoque: string;
    NomeUsuario: string;
    Total?: number;
    Is_Selecionado?: boolean;
    Is_PV_Resultante?: boolean
}

/**
 * Traz os produtos + os dados da PV
 */
export interface IProductsPVAndPVData {
    pvModel: IPreVendaItemListModel,
    products: IProductsPvModel
}


/** RES PRODUTOS PV */
export interface IProductsPvModel {
    IsOk: boolean;
    Msg: string;
    List: IProductItemModel[];
}

export interface IProductItemModel {
    Id: string;
    Codigo: number;
    Sequencia: number;
    Descricao: string;
    Quantidade: number;
    Unidade: string;
    TotalLiquido: number;
    TotalBruto: number;
    TotalDesconto: number;
    PrecoUnitario: number;
    PrecoTabela: number;
    PrecoTabela2: string;
    Imagem: string;
    gg008_ID: string;
    gg008_Kdx_ID: string;
    gg520_ID: string;
    IsMontar: boolean,
    IsSaldoNegativo: boolean,
    IsRequisitar: boolean,
    IsEntregar: boolean
}

/**
 * INTERFACE PADRAO DE PV, TENANT E PRODUTO PV ID
 */
export interface IPVTenant {
    TenantId: number,
    AtendimentoId: string
}

/**
 * INTERFACE RELACIONADA AOS DESCONTOS DE PRODUTOS DA PV
 */
export interface IPVProductDiscount {
    AtendimentoProdutoId: string,
    Valor: number
}
