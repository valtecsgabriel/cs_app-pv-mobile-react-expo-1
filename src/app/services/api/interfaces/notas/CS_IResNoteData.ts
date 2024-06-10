export interface IResNotaProdutoItem {
    DD060_Id: string;
    DD060_Descricao: string;
    DD060_Quantidade: number;
    dd060_InfAdProd: string;
    DD060_mod_Entrega: string;
    DD060_image_url: string;
    DD060_Cor_Serie_Merc: string;
}

export interface IResInfoNota {
    result: string;
    dd040_id: string;
    protocolo: string;
    cliente: string;
    n_nota: string;
    tp_nota: string;
    dt_emissao: string;
    situacao: string;
    isOk: boolean;
}

export interface IResDadosNota {
    Produtos: IResNotaProdutoItem[];
    info_Nota: IResInfoNota;
}