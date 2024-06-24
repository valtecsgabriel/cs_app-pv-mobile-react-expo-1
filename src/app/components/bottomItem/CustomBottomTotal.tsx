import { View, Text, StyleSheet } from "react-native";
import CustomBottomItem from "./CustomBottomItem";
import { commonStyle } from "../../CommonStyle";

export interface IListaComando {
    total: number;
}

export const CustomBottomTotal = ({total }: IListaComando) => {


    return (
        <CustomBottomItem height={80}>
            <View style={[styles.row, styles.space_between, commonStyle.common_margin_horizontal]}>
                <Text style={[styles.total_liquido_text, styles.padding_12]}>Total</Text>
                <Text style={[styles.valor, styles.padding_12]}>{total}</Text>
            </View>
        </CustomBottomItem>
    );
}

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E3E3E3",
        height: 100
    },
    row: {
        flexDirection: 'row'
    },
    padding_12: {
        padding: 12
    },
    padding_16: {
        padding: 16
    },
    space_between: {
        justifyContent: 'space-between'
    },
    total_liquido_text: {
        fontSize: 22,
        fontWeight: '600'
    },
    valor: {
        fontSize: 22,
        fontWeight: '600',
        color: '#0A3147'
    },
    btnStyle: {
        marginLeft: 32,
        marginRight: 32,
        marginBottom: 16,
        backgroundColor: "#A3C5D9",
        borderRadius: 20,
        height: 40,
        width: 230,
        justifyContent: 'center',
        alignSelf: 'center',
        elevation: 2
    },
    txtBtnStyle: {
        color: '#0A3147',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 16.94
    }

})
