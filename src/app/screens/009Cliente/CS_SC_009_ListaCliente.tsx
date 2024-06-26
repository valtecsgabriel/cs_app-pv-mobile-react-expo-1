import { useEffect, useState } from "react";
import { handleGetListConta } from "../../view_controller/conta/ContaViewController";
import { Csicp_bb012 } from "../../services/api/interfaces/contas/CS_IResGetListConta";
import { ToastType, showToast } from "../../util/ShowToast";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import Custom_Pagination from "../../components/pagination/Custom_Pagination";
import { getPaginationList } from "../../util/GetPaginationArray";
import CustomSearch from "../../components/search/CustomSearch";
import CustomCard004 from "../../components/cards/CustomCard_004";
import { commonStyle } from "../../CommonStyle";
import { FETCH_STATUS } from "../../util/FETCH_STATUS";

const CS_SC_009_ListaCliente = () => {
    const [clientList, setClientList] = useState<Csicp_bb012[]>()
    const [paginationArray, setPaginationArray] = useState<number[]>()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE);

    function getClientesList(page: number) {
        setStatus(FETCH_STATUS.LOADING)
        handleGetListConta({ currentPage: page, pageSize: 10, modRelacaoID: 1 }).then((res) => {
            try {
                if (res !== undefined) {
                    setClientList(res.csicp_bb012)
                    const pagesArray = getPaginationList(res.PageSize.cs_list_total_itens)
                    setPaginationArray(pagesArray)
                    setStatus(FETCH_STATUS.SUCCESS)
                }
            } catch (error: any) {
                showToast(ToastType.ERROR, "Falha", error)
                setStatus(FETCH_STATUS.SUCCESS)
            }
        })
    }

    useEffect(() => {
        getClientesList(1)
    }, [])


    const isLoading = status === FETCH_STATUS.LOADING



    return (
        <SafeAreaView style={{ flex: 1 }}>
            {!isLoading ? <>
                <CustomSearch onSearchPress={() => { }} placeholder="Pesquisar" clickToSearch={true} />
                <FlatList
                    data={clientList}
                    keyExtractor={(item) => item.csicp_bb012.ID.toString()}
                    renderItem={({ item }) => <RenderItemCliente item={item} />}
                />
            </> : <ActivityIndicator />}
            <Custom_Pagination
                paginationArray={paginationArray!}
                onPagePress={getClientesList}
            />
        </SafeAreaView>
    );
}

const RenderItemCliente = ({ item }: { item: Csicp_bb012 }) => {
    return (
        <View>
            <CustomCard004 children={
                <View style={commonStyle.common_columnItem}>
                    <Text style={commonStyle.common_fontWeight_800}>{item.csicp_bb012.BB012_Codigo}</Text>
                    <Text style={commonStyle.common_fontWeight_800}>{item.csicp_bb012.BB012_Nome_Cliente}</Text>
                    <Text style={commonStyle.common_fontWeight_800}>{item.csicp_bb012.BB012_Is_Active}</Text>
                </View>
            } title={item.csicp_bb012.BB012_Nome_Cliente} />
        </View>
    )
}

export default CS_SC_009_ListaCliente;