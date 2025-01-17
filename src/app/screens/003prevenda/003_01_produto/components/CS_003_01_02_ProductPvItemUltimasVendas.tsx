import Ioicons from '@expo/vector-icons/Ionicons';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { commonStyle } from "../../../../CommonStyle";
import CustomEmpty from '../../../../components/lists/CustomEmpty';
import CustomSeparator from "../../../../components/lists/CustomSeparator";
import { IProdutoItemUltimasVendas } from '../../../../services/api/interfaces/produto/CS_IResGetUltimasVendasProduto';
import { formatMoneyValue } from '../../../../util/FormatText';

const data = [
    { id: 1, protocolo: '123', emissao: '14/12/2020', serie: '123', preçoVenda: 'R$ 14,30', total: 'R$ 15,16', quantidade: 12 },
    { id: 2, protocolo: '456', emissao: '25/01/2021', serie: '456', preçoVenda: 'R$ 20,50', total: 'R$ 22,35', quantidade: 13 },
    { id: 3, protocolo: '789', emissao: '03/05/2021', serie: '789', preçoVenda: 'R$ 30,80', total: 'R$ 32,45', quantidade: 2 }
]
const CS_003_01_02_ProductPvItemUltimasVendas = ({ close, lastSales }: { close: () => void, lastSales: IProdutoItemUltimasVendas[] }) => {

    return (
        <View>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, common003_01_styles.blueBackgroundColor]}>
                <View style={[commonStyle.common_rowItem, common003_01_styles.blueBackgroundColor]}>
                    <Text style={[commonStyle.common_fontWeight_600, common003_01_styles.titleItem]}>3 Últimas Vendas</Text>
                </View>
                <View style={[commonStyle.common_rowItem, common003_01_styles.blueBackgroundColor, { marginRight: 2, justifyContent: 'flex-end' }]}>
                    <Ioicons name="close-outline" size={22} onPress={close} />
                </View>
            </View>


            <FlatList
                data={lastSales}
                ItemSeparatorComponent={CustomSeparator}
                keyExtractor={(item) => item.ProtocoloVenda.toString()}
                renderItem={({ item }) => <LastSalesRenderItem item={item} />}
                ListEmptyComponent={CustomEmpty}
            />
        </View>
    );
}

const LastSalesRenderItem = ({ item }: { item: IProdutoItemUltimasVendas }) => {
    return (
        <View style={[commonStyle.common_columnItem]}>
            <View style={[commonStyle.common_rowItem, common003_01_styles.container]}>
                <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_top_8, commonStyle.common_margin_bottom_8]}>Protocolo:</Text>
                <Text style={[common003_01_styles.value, commonStyle.common_margin_top_8, commonStyle.common_margin_bottom_8]}>{item.ProtocoloVenda}</Text>
            </View>



            <View style={[commonStyle.common_rowItem, common003_01_styles.container, { justifyContent: 'space-between', marginHorizontal: 64 }]}>
                <View style={commonStyle.common_columnItem}>
                    <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_bottom_8, commonStyle.common_margin_top_8]}>Emissão</Text>
                    <Text style={[common003_01_styles.value, commonStyle.common_margin_bottom_8]} >{item.Emissao}</Text>
                </View>
                <View style={commonStyle.common_columnItem}>
                    <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_bottom_8, commonStyle.common_margin_top_8, { marginRight: 24 }]}>Série</Text>
                    <Text style={[common003_01_styles.value, commonStyle.common_margin_bottom_8, { marginRight: 24 }]}>{item.Serie_NF}</Text>
                </View>
            </View>


            <View style={[commonStyle.common_rowItem, common003_01_styles.container, { justifyContent: 'space-between', marginHorizontal: 64 }]}>
                <View style={commonStyle.common_columnItem}>
                    <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_bottom_8, commonStyle.common_margin_top_8]}>Preço Venda</Text>
                    <Text style={[common003_01_styles.value, commonStyle.common_margin_bottom_8]}>{formatMoneyValue(item.PrecoVenda)}</Text>
                </View>
                <View style={{ borderLeftWidth: 1, borderColor: '#c3c3c3', height: '175%', marginBottom: 76, alignSelf: 'center' }} />
                <View style={commonStyle.common_columnItem}>
                    <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_bottom_8, commonStyle.common_margin_top_8]}>Total</Text>
                    <Text style={[common003_01_styles.value, commonStyle.common_margin_bottom_8]}>{formatMoneyValue(item.TotalVenda)}</Text>
                </View>
            </View>


            <View style={[commonStyle.common_rowItem, common003_01_styles.container]}>
                <Text style={[common003_01_styles.title, commonStyle.common_fontWeight_600, commonStyle.common_margin_top_8, commonStyle.common_margin_bottom_8]}>Quantidade:</Text>
                <Text style={[common003_01_styles.value, commonStyle.common_margin_top_8, commonStyle.common_margin_bottom_8]}>{item.Quantidade}</Text>
            </View>
        </View>
    );
}

const common003_01_styles = StyleSheet.create({
    blueBackgroundColor: {
        backgroundColor: "#A3C5D9"
    },
    titleItem: {
        color: "#0A3147",
        fontSize: 18,
        marginLeft: '45%'
    },
    container: {
        justifyContent: 'center'
    },
    title: {
        fontSize: 16
    },
    value: {
        fontSize: 16,
        textAlign: 'center'
    }

})

export default CS_003_01_02_ProductPvItemUltimasVendas;