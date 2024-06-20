import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, SafeAreaView } from "react-native";
import { IResGetPv } from "../../../services/api/interfaces/prevenda/CS_Common_IPreVenda";
import { IResProductItemModel, IResProductsListPvModel } from "../../../services/api/interfaces/prevenda/CS_IResProdutosPreVenda";
import { FETCH_STATUS } from "../../../util/FETCH_STATUS";
import { handleDeleteProductFromPv, handleGetProductsPv, handleGetPv, handleUpdatePercentDiscount, handleUpdateTablePrice, handleUpdateUnityPrice, handleUpdateValueDiscount } from "../../../view_controller/prevenda/PreVendaViewController";
import C_003_01_04_BottomScreenItemProdutosDetalhesPV from "./components/C_003_01_04_BottomScreenItemProdutosDetalhesPV";
import C_003_01_05_TopHeaderItensProdutosDetalhesPV from "./components/C_003_01_05_TopHeaderItensProdutosDetalhesPV";
import { C_003_01_ProductPvItem } from "./components/C_003_01_ProductPvItem";
import { ToastType, showToast } from "../../../util/ShowToast";
import { formatDateToSlashPattern, formatMoneyValue } from "../../../util/FormatText";
import CustomEmpty from "../../../components/lists/CustomEmpty";


const CS_SC_003_01_PreVendaDetalheProduto = () => {
    const [productsPv, setProductsPv] = useState<IResProductItemModel[]>([])
    const [pv, setPv] = useState<IResGetPv>()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE)


    useEffect(() => {
        getProductsToCurrentPv()
    }, [])


    function getProductsToCurrentPv() {
        setStatus(FETCH_STATUS.LOADING)

        //pega a pv
        handleGetPv().then((res) => {
            if (res !== undefined) {
                setPv(res)
                //depois pega os produtos
                handleGetProductsPv().then((res) => {
                    const response = res as IResProductsListPvModel
                    if (response.IsOk) {
                        setProductsPv(response.List)
                    }
                    setStatus(FETCH_STATUS.SUCCESS)
                })
            }
        })
    }

    function deleteProduct(productId: string) {
        handleDeleteProductFromPv(productId).then((res) => {
            if (res) {
                getProductsToCurrentPv()
            }
        })
    }

    function handleRefreshProducts(): void {
        getProductsToCurrentPv()
    }

    function updateDiscountPercent(productId: string, discountPercent: number, getProductsToCurrentPv: () => void): void {
        handleUpdatePercentDiscount({ AtendimentoProdutoId: productId, Valor: discountPercent })
            .then((res) => {
                if (res.IsOk) {
                    getProductsToCurrentPv()
                } else {
                    showToast(ToastType.ERROR, "Falha", res.Msg)
                }
            });
    }


    function updateValueDiscount(productId: string, valueDiscount: number): void {
        handleUpdateValueDiscount({ AtendimentoProdutoId: productId, Valor: valueDiscount })
            .then((res) => {
                if (res.IsOk) {
                    getProductsToCurrentPv()
                } else {
                    showToast(ToastType.ERROR, "Falha", res.Msg)
                    showToast(ToastType.ERROR, "Falha", res.Msg)
                }
            });
    }



    function updateTablePrice(productId: string, tablePrice: number): void {
        handleUpdateTablePrice({ AtendimentoProdutoId: productId, Valor: tablePrice })
            .then((res) => {
                if (res.IsOk) {
                    getProductsToCurrentPv()
                } else {
                    showToast(ToastType.ERROR, "Falha", res.Msg)
                }
            });
    }



    function updateUnityPrice(productId: string, unityPrice: number): void {
        handleUpdateUnityPrice({ AtendimentoProdutoId: productId, Valor: unityPrice })
            .then((res) => {
                if (res.IsOk) {
                    getProductsToCurrentPv()
                } else {
                    showToast(ToastType.ERROR, "Falha", res.Msg)
                }
            });
    }


    const isLoading = status === FETCH_STATUS.LOADING
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            {isLoading ? <ActivityIndicator /> : <>
                <FlatList
                    data={productsPv}
                    keyExtractor={(item) => item.Id!}
                    refreshing={isLoading}
                    onRefresh={handleRefreshProducts}
                    ListEmptyComponent={<CustomEmpty text="Essa PV não tem produtos!" />}
                    ListHeaderComponent={C_003_01_05_TopHeaderItensProdutosDetalhesPV}
                    renderItem={({ item }) => (
                        <C_003_01_ProductPvItem
                            product={item}
                            onDeleteProductClick={(productId) => { deleteProduct(productId) }}
                            saveDiscountPercent={(discountPercent, productId) => updateDiscountPercent(productId, discountPercent, getProductsToCurrentPv)}
                            saveDiscountValue={(valueDiscount, productId) => updateValueDiscount(productId, valueDiscount)}
                            saveTablePrice={(tablePrice, productId) => updateTablePrice(productId, tablePrice)}
                            saveUnityPrice={(unityPrice, productId) => updateUnityPrice(productId, unityPrice)}
                        />
                    )}
                />

                <C_003_01_04_BottomScreenItemProdutosDetalhesPV
                    dataEmissao={formatDateToSlashPattern(pv?.Data_Emissao || '1999-01-01')}
                    dataValidade={formatDateToSlashPattern(pv?.DataValidade || '1999-01-01')}
                    totalLiquido={formatMoneyValue(pv?.TotalLiquido || 0)}
                />
            </>}

        </SafeAreaView>
    );

}

export default CS_SC_003_01_PreVendaDetalheProduto;

