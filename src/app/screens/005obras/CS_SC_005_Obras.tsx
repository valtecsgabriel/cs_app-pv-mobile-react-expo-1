import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { commonStyle } from "../../CommonStyle";
import CustomCard_001 from "../../components/containers/CustomCard_001";
import CustomIcon from "../../components/icon/CustomIcon";
import CustomSeparator from "../../components/lists/CustomSeparator";
import CustomVerticalSeparator from "../../components/lists/CustomVertticalSeparator";
import Custom_Pagination from "../../components/pagination/Custom_Pagination";
import CustomSearch from "../../components/search/CustomSearch";
import { Dd190_Obras } from "../../services/api/interfaces/obras/CS_IResGetListObras";
import { FETCH_STATUS } from "../../util/FETCH_STATUS";
import { ICON_NAME } from "../../util/IconsName";
import { ToastType, showToast } from "../../util/ShowToast";
import { handleGetListObras, handleGetPagesArray } from "../../view_controller/obras/CS_ObrasViewController";
import CustomListWithPagination from "../../components/lists/CustomListWithPagination";

const CS_SC_005_Obras = () => {
    const [paginationArray, setPaginationArray] = useState<number[]>([])
    const [listObras, setListObras] = useState<Dd190_Obras[]>()
    const [status, setStatus] = useState(FETCH_STATUS.IDLE);
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        getListObras()
    }, [])

    function getListObras(page?: number) {
        setStatus(FETCH_STATUS.LOADING)
        try {
            handleGetListObras({ currentPage: page, dataFim: '2024-06-11', dataInicio: '2023-01-01' }).then(async (res) => {
                if (res === undefined) {
                    return
                }
                const pagesArray = await handleGetPagesArray(res.Contador.cs_list_total_itens)
                setPaginationArray(pagesArray)
                setListObras(res.dd190_Obras)
            })
        } catch (error: any) {
            showToast(ToastType.ERROR, "Error", error)
        } finally {
            setStatus(FETCH_STATUS.SUCCESS)
        }
    }

    const isLoading = status == FETCH_STATUS.LOADING
    const isError = status == FETCH_STATUS.ERROR

    if (isLoading) {
        return (
            <ActivityIndicator size={45} />
        )
    }

    return (
        <View>
            <View style={{ height: (windowHeight * 85) / 100 }}>
                <CustomListWithPagination
                    list={listObras!}
                    renderItemComponent={(item) => <RenderItem item={item} />}
                    paginationArray={paginationArray}
                    getPage={(page) => getListObras(page)}
                />
            </View>
        </View>
    );
}

const RenderItem = ({ item }: { item: Dd190_Obras }) => {
    const [extraIconsRightOpen, setExtraIconsRightOpen] = useState(false);
    const leftSwipe = () => {
        setExtraIconsRightOpen(!extraIconsRightOpen);
    };
    return (
        <View>
            <CustomCard_001
                title={item.DD190_Obra.csicp_dd190.dd190_Descricao}
                children={<CustomCardObraChildren leftSwipe={leftSwipe} isRightChildrenOpen={extraIconsRightOpen} item={item} />}
                rightChildren={<RightItem obraId={item.DD190_Obra.csicp_dd190.dd190_Id} />}
                showRightChildren={extraIconsRightOpen}
            />
        </View>
    )
}

const RightItem = ({ obraId }: { obraId: number }) => {
    const { navigate } = useNavigation()
    return (
        <View style={[commonStyle.common_columnItem,
        { backgroundColor: "#95B5C7", flex: 1, padding: 8, paddingVertical: 16, borderTopRightRadius: 16, borderBottomRightRadius: 16 },
        commonStyle.justify_content_space_btw]}>
            <CustomIcon icon={ICON_NAME.ENVIAR} onPress={() => {
                console.log("sol");

                navigate('Obras_Solicitacao', { obraId: obraId })
            }} />
            <CustomIcon icon={ICON_NAME.CHAT} onPress={() => { }} />
            <CustomIcon icon={ICON_NAME.PAPEL_LISTA_CONTORNADO} onPress={() => {
                console.log("req");
                navigate('Obras_Requisicao', { obraId: obraId })
            }} />
            <CustomIcon icon={ICON_NAME.ANEXO} onPress={() => { }} />
        </View>
    )
}

const CustomCardObraChildren = ({ leftSwipe, isRightChildrenOpen, item }: { leftSwipe: () => void, isRightChildrenOpen: boolean, item: Dd190_Obras }) => {
    return (
        <View>
            <View style={[commonStyle.common_columnItem, { alignSelf: 'center', padding: 4 }]}>
                <Text style={[commonStyle.common_fontWeight_600]}>{item.DD190_Obra.csicp_bb012.BB012_Nome_Cliente}</Text>
                <View style={commonStyle.common_rowItem}>
                    <Text style={[commonStyle.common_fontWeight_600]}>PPTR: </Text>
                    <Text>{item.DD190_Obra.csicp_dd190.dd190_ProtocolNumber}</Text>
                </View>
            </View>

            <CustomSeparator />

            <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw, { margin: 16 }]}>
                <View style={[commonStyle.common_columnItem]}>
                    <Text style={[commonStyle.common_fontWeight_600]}>Data Movimento</Text>
                    <Text>{item.DD190_Obra.csicp_dd190.dd190_dMovto}</Text>
                </View>
                <CustomVerticalSeparator />
                <View style={[commonStyle.common_columnItem]}>
                    <Text style={[commonStyle.common_fontWeight_600]}>Inicio Exec</Text>
                    <Text>{item.DD190_Obra.csicp_dd190.dd190_dInicioExec}</Text>
                </View>
                <CustomVerticalSeparator />
                <View style={[commonStyle.common_columnItem]}>
                    <Text style={[commonStyle.common_fontWeight_600]}>Fim Exec</Text>
                    <Text>{item.DD190_Obra.csicp_dd190.dd190_dFinalExec}</Text>
                </View>
            </View>
            <CustomSeparator />
            <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_evl, { margin: 8 }]}>
                <View style={[commonStyle.common_columnItem]}>
                    <Text style={[commonStyle.common_fontWeight_600]}>Proprietário</Text>
                    <Text>{item.DD190_Obra.csicp_sy001_UsuarioProp.SY001_Nome}</Text>
                </View>
                <View style={[commonStyle.common_columnItem]}>
                    <Text style={[commonStyle.common_fontWeight_600]}>Responsavel</Text>
                    <Text>{item.DD190_Obra.csicp_sy001_RespTecnico.SY001_Nome}</Text>
                </View>
            </View>

            <View style={{ alignSelf: 'center', marginTop: 16 }}>
                <Text style={[commonStyle.common_fontWeight_600]}>{item.DD190_Obra.csicp_dd191_st.Label}</Text>
            </View>

            <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_evl]}>
                <Text style={{ marginLeft: 32 }}></Text>
                <Pressable style={[commonStyle.common_button_style]} onPress={leftSwipe}>
                    <Text style={commonStyle.common_text_button_style}>Obras Filha</Text>
                </Pressable>
                {isRightChildrenOpen ? <CustomIcon icon={ICON_NAME.FLECHA_ESQUERDA} onPress={leftSwipe} /> : <CustomIcon icon={ICON_NAME.FLECHA_DIRETA} onPress={leftSwipe} />}

            </View>
        </View>
    )
}

export default CS_SC_005_Obras;