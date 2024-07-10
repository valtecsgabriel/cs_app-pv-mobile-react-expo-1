import { useNavigation } from "@react-navigation/native";
import React, { lazy, Suspense, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";
import ColorStyle from "../../ColorStyle";
import { commonStyle } from "../../CommonStyle";
import CustomIcon from "../../components/icon/CustomIcon";
import CustomEmpty from "../../components/lists/CustomEmpty";
import CustomAlertDialog from "../../components/modal/CustomAlertDialog";
import Custom_Pagination from "../../components/pagination/Custom_Pagination";
import CustomProduct from "../../components/product/CustomProduct";
import CustomSwitch from "../../components/switch/CustomSwitch";
import { DataKey } from "../../enum/DataKeys";
import { IReqGetProductSearch } from "../../services/api/interfaces/produto/CS_IReqGetProdutoSearch";
import { IResGetProductItem } from "../../services/api/interfaces/produto/CS_IResGetProdutoSearch";
import { getSimpleData } from "../../services/storage/AsyncStorageConfig";
import { FETCH_STATUS } from "../../util/FETCH_STATUS";
import { formatMoneyValue } from "../../util/FormatText";
import { ICON_NAME } from "../../util/IconsName";
import { showToast, ToastType } from "../../util/ShowToast";
import { handleInsertProductPv } from "../../view_controller/prevenda/PreVendaViewController";
import { handleSearchProduct } from "../../view_controller/produto/ProductViewController";
import { stylesConsultaProduto } from "./ConsultaProdutoStyles";

const CustomSearch = lazy(() => import("../../components/search/CustomSearch"))

const CS_SC_ConsultaProdutos = ({ route }: { route: any }) => {

    // Estados para gerenciar a lista de produtos, status de carregamento, paginação, mensagens de erro e filtros de pesquisa
    const [productList, setProductList] = useState<IResGetProductItem[]>()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE);
    const [paginationArray, setPaginationArray] = useState<number[]>([])
    const [productAtributtesToSearch, setProductAtributtesToSearch] = useState<IReqGetProductSearch>()
    const cameFromPv = route.params.cameFromPv
    const { navigate } = useNavigation()


    // Função para inserir produto na pré-venda
    function scInsertProductPv(product: IResGetProductItem) {
        setStatus(FETCH_STATUS.BTN_CLICK)
        getSimpleData(DataKey.CurrentPV).then((currentPv) => {
            const pvId = currentPv as string
            handleInsertProductPv(
                product.CodgProduto!.toString(),
                false, // is entrega
                1, // quantidade
                1, // tipo atendimento
                cameFromPv ? pvId : undefined, // pv id
                undefined // conta id
            ).then(() => {
                setStatus(FETCH_STATUS.SUCCESS)
                showToast(ToastType.SUCCESS, "Tudo certo!", "Produto adicionado com sucesso!")
                if (cameFromPv) {
                    navigate('Pre_Venda_Detalhes', {
                        currentPv: pvId
                    })
                }
            })
        })
    }

    // Flags para determinar o estado atual do carregamento
    const isLoading = status == FETCH_STATUS.LOADING
    const openModal = status == FETCH_STATUS.MODAL
    const loadingBtnClickItem = status == FETCH_STATUS.BTN_CLICK

    // Função para abrir o modal de filtros
    function handleFilterClick() {
        setStatus(FETCH_STATUS.MODAL)
    }


    // Função para realizar a busca de produtos
    const handleFormSubmitToSearch = (valueToSearch?: any, page?: number) => {
        /** caso a chamada seja feita por paginação, mudar o tipo de loading para manter a paginação mostrando em tela
         * enquanto o usuário estiver vendo uma lista de produto baseado nos filtros dele.
         */

        /** Foi criada a variavel _filterValues para fazermos a busca, porem
         * para mostrar a lista precisamos de um objeto filterValues 
         * que tenha controle de estado a nivel da tela. Por iss foi implementado o useState que
         * guarda o _filterValues, para que possamos usar o filterValues na flat list.
        */

        /**
         * Os valores de formData seguem a estrutura de titles que formam o formFields
         * Ex: Dominio: 'Comercial'; Usuario: 'Valter'; Senha:'xpto'
         * A chave das propriedades é o que será usado em 'key' -> formData.[key]
         * 
         */

        setStatus(FETCH_STATUS.LOADING)
        const _filterValues: IReqGetProductSearch = {
            cs_page: page || 1,
            /** testa se tem apenas numeros, se sim, preenche o codigo, se nao, preenche a descricao */
            cs_codigo_produto: /^\d+$/.test(valueToSearch) ? valueToSearch : undefined,
            cs_descricao_reduzida: /^\d+$/.test(valueToSearch) ? undefined : valueToSearch,
            cs_is_com_saldo: valueToSearch.isSaldo
        };
        //seta os valores para o filter values que sera enviado na chamada da api
        setProductAtributtesToSearch(_filterValues)

        //chamada da api
        handleSearchProduct(_filterValues!).then((res) => {
            if (res.isOk == false) {
                navigate('Menu')
                showToast(ToastType.ERROR, "Erro", "Indefinição na resposta do servidor, provável erro de domínio")
            }

            if (res.isOk) {
                setProductList(res.productResponse?.List)
                setPaginationArray(res.pagesArray)
                setStatus(FETCH_STATUS.SUCCESS)
            } else {
                // @ts-ignore
                setStatus(FETCH_STATUS.ERROR)
            }
        })

    };

    function handleRefreshList(): void {
        handleFormSubmitToSearch(productAtributtesToSearch?.cs_codigo_produto || productAtributtesToSearch?.cs_descricao_reduzida, productAtributtesToSearch?.cs_page)
    }



    // Renderização da tela
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <Suspense fallback={<ActivityIndicator style={[commonStyle.align_centralizar, { height: "100%" }]} size="large" color={ColorStyle.colorPrimary200} />}>

                <View>
                    {/* Componente de pesquisa */}
                    <CustomSearch
                        placeholder="Pesquisar Produto"
                        onSearchPress={handleFormSubmitToSearch}
                        onFilterClick={handleFilterClick}
                        clickToSearch={true} />

                    {/* Carregamento da lista de produtos ou exibição da lista */}
                    {isLoading ? <ActivityIndicator style={[commonStyle.align_centralizar, { height: "100%" }]} size="large" color={ColorStyle.colorPrimary200} /> :
                        <View>
                            <FlatList
                                data={productList}
                                refreshing={isLoading}
                                onRefresh={handleRefreshList}
                                keyExtractor={(item) => item.Id!.toString()}
                                ListEmptyComponent={<CustomEmpty text={"Nenhum produto encontrado!"} />}
                                renderItem={({ item }) => <CustomProduct
                                    onClickItem={() => { }}
                                    children={<ProductItem product={item} />}
                                    image={<ImageProductItem descProd={item.DescArtigo!} image={item.Imagens?.find((val) => val.IsPadrao)?.URL_Path} />}
                                    rightItem={<>
                                        <RightItem
                                            loadingClick={loadingBtnClickItem}
                                            click={() => scInsertProductPv(item)}
                                        />
                                    </>}
                                />}
                            />

                        </View>
                    }
                </View>



                {/* Modal para filtros */}
                <CustomAlertDialog
                    isVisible={openModal}
                    onDismiss={() => { }}
                    children={<ModalSwitchFilter titles={['Promoção', 'Com Saldo']} search={(filters) => {
                        handleFormSubmitToSearch(filters)
                    }} close={() => setStatus(FETCH_STATUS.IDLE)} />}
                />

            </Suspense>

            {/* Modal para filtros */}
            <CustomAlertDialog
                isVisible={openModal}
                onDismiss={() => { }}
                children={<ModalSwitchFilter titles={['Promoção', 'Com Saldo']} search={(filters) => {
                    handleFormSubmitToSearch(filters)
                }} close={() => setStatus(FETCH_STATUS.IDLE)} />}
            />

            {paginationArray.length > 1 && (
                <View>
                    <Custom_Pagination
                        onPagePress={(page) => handleFormSubmitToSearch(productAtributtesToSearch?.cs_descricao_reduzida, page)}
                        paginationArray={paginationArray} />
                </View>
            )}
        </View>

    );
}

// Componente de exibição da imagem do produto
const ImageProductItem = ({ descProd, image }: { descProd: string, image?: string }) => {
    return (
        <>{image !== undefined && (
            <Image style={commonStyle.productImage}
                source={{ uri: image }} />
        )}

            {image === undefined && (
                <Text style={[commonStyle.align_centralizar, {
                    width: 111,
                    backgroundColor: '#A3C5D9',
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12
                }]}>{descProd.substring(0, 3)}</Text>
            )}

        </>
    );
}

// Componente de exibição das informações do produto
const ProductItem = ({ product }: { product: IResGetProductItem }) => {
    return (
        <View style={commonStyle.justify_content_space_btw}>
            <Text style={stylesConsultaProduto.productCode}>{`Código:  ${product.CodgProduto}`}</Text>
            <Text style={stylesConsultaProduto.productDesc}>{`${product.DescArtigo}`}</Text>
            <Text style={stylesConsultaProduto.productPrice}>{`${formatMoneyValue(product.Preco!)}`}</Text>
        </View>
    )
}

// Componente do botão direito para adicionar o produto à pré-venda
const RightItem = ({ click, loadingClick }: { click: () => void, loadingClick: boolean }) => {
    return (
        <View style={stylesConsultaProduto.rightIcons}>
            <Pressable onPress={click}>
                {loadingClick ? <ActivityIndicator size={32} color={"#000"} /> : <CustomIcon icon={ICON_NAME.CARRINHO_CONTORNADO} />}
            </Pressable>
        </View>
    )
}

// Componente do modal de filtros com switches para promoção e saldo
const ModalSwitchFilter = ({ titles, close, search }: { titles: string[], search: (filter: any) => void, close: () => void }) => {
    const [filter, setFilter] = useState({
        isPromo: false,
        isSaldo: false
    })
    return (
        <View style={{ flexDirection: 'column', backgroundColor: "#fff", width: '80%', padding: 8, borderRadius: 32, justifyContent: 'center' }}>
            <CustomIcon icon={ICON_NAME.LIXEIRA} onPress={close} />
            <CustomSwitch
                title={titles[0]}
                switchValue={filter.isPromo}
                onValueChange={(value) => setFilter({ isPromo: value, isSaldo: filter.isSaldo })}
            />
            <CustomSwitch
                title={titles[1]}
                switchValue={filter.isSaldo}
                onValueChange={(value) => setFilter({ isPromo: filter.isPromo, isSaldo: value })}
            />
            <Pressable style={commonStyle.common_button_style} onPress={() => search(filter)}>
                <Text style={commonStyle.common_text_button_style}>Filtrar</Text>
            </Pressable>
        </View>
    )
}

export default CS_SC_ConsultaProdutos;