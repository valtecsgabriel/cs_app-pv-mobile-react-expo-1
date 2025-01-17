import { View, Text } from "react-native";
import { commonStyle } from "../../CommonStyle";
import { ReactNode } from "react";


/**
 * TOPO DO CARD TODO AZUL, UM TEXTO NO MEIO, O CORPO É DESENHADO CONFORME O DESIGN E PASSADO AO CHILDREN
 * Ref: OBRA LISTA
 */
const CustomCard_001 = ({ title, children, rightChildren, showRightChildren = false }: { title: string, children: ReactNode, rightChildren?: ReactNode, showRightChildren?: boolean }) => {
    return (
        <View style={[commonStyle.margin_16, commonStyle.common_rowItem, { backgroundColor: '#95B5C7', borderRadius: 32 }]}>
            <View style={[commonStyle.common_columnItem, { flex: 1 }]}>
                <View style={[{ backgroundColor: '#A3C5D9', borderTopLeftRadius: 16, borderTopRightRadius: 16, elevation: 1 }]}>
                    <Text style={{ color: '#2E2E2E', fontWeight: '600', fontSize: 18, alignSelf: 'center', padding: 16 }}>{title}</Text>
                </View>
                <View style={{ overflow: 'hidden', backgroundColor: '#FFF', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, elevation: 2 }}>
                    {children}
                </View>
            </View>
            {showRightChildren && (
                <View >
                    {rightChildren}
                </View>
            )}
        </View>
    );
}

export default CustomCard_001;