/**
 * Lida somente com a lista de produto
 */
export interface IResGetProductItem {
    Id?: string;
    CodgProduto?: number;
    DescArtigo?: string;
    DescMarca?: string;
    Referencia?: string;
    Complemento?: string;
    DescReduzida?: string;
    DescGrupo?: string;
    DescClasse?: string;
    SubGrupo?: string;
    Preco?: number;
    PrcPromocional?: number;
    isArredondaUnSec?: boolean;
    isUnSec?: boolean;
    isUnSecFracionado?: boolean;
    isUnFracionado?: boolean;
    UnidadeSecundaria?: string;
    Unidade?: string;
    Saldo?: number
    Imagens?: {
        SeqOrdem: number;
        URL_Path: string;
        IsPadrao?: boolean;
    }[];
}

/**
 * Lida com toda a estrutura de retorno, as mensagens +  a lista
 */
export interface IResProdutoSearch {
    cs_is_ok: boolean,
    cs_total_count: number,
    c_pages_number: number,
    cs_msg?: string
    List: IResGetProductItem[]
}
