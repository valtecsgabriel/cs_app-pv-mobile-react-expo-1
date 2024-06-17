import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { commonStyle } from "../../CommonStyle";
import CustomCard_001 from "../../components/cards/CustomCard_001";
import CustomCard_003 from "../../components/cards/CustomCard_003";
import CustomSeparator from "../../components/lists/CustomSeparator";
import { PaymentType } from "../../services/api/interfaces/pagamento/CS_IReqListFormPayment";
import { TermItem } from "../../services/api/interfaces/pagamento/IResPaymentTerm";
import { ToastType, showToast } from "../../util/ShowToast";
import { handleGetListOfPaymentForm, handleGetPaymentTerm, handleGetPaymentTermList } from "../../view_controller/pagamento/CS_PagamentoViewController";

const CS_SC_007_Pagamento = () => {

    return (
        <SafeAreaView>
            <TopOfScreen />

            <CustomSeparator />

            <BuyValues />


            <CustomCard_003 children={<ItemSelecao />} />

            <Text>Detalhamento</Text>
            <CustomCard_001 title="Forma - Condição - Valor" children={<ItemDetalhamento />} />
        </SafeAreaView>
    );
}

const TopOfScreen = () => {
    return (
        <View>
            <Text style={[commonStyle.text_aligment_center, commonStyle.common_fontWeight_600, commonStyle.margin_8, commonStyle.font_size_18, { color: '#0A3147' }]}>200400000000000</Text>
            <Text style={[commonStyle.text_aligment_center, commonStyle.font_size_16, { color: '#0A3147' }]}>99999 - Venda à  vista PDV-PA</Text>
        </View>
    )
}

const BuyValues = () => {
    return (
        <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw, commonStyle.margin_8]}>
            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.common_fontWeight_600, , commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Total da Compra
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, { color: '#0A3147' }]}>
                    RS125
                </Text>
            </View>

            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.common_fontWeight_600, , commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Valor Pago
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, { color: '#0A3147' }]}>
                    RS125
                </Text>
            </View>

            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.common_fontWeight_600, , commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Valor a Pagar
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, { color: '#0A3147' }]}>
                    RS125
                </Text>
            </View>

        </View>
    )
}


enum PaymentStage {
    FORMA = 1,
    CONDICAO = 2,
    PAGAMENTO = 3
}
const ItemSelecao = () => {
    /** o item atual correspondente a forma, condicao ou pagamento, para mostrar em tela */
    const [currentItem, setCurrentItem] = useState(PaymentStage.FORMA)
    const [formaId, setFormaId] = useState('')
    const [condicaoId, setCondicaoId] = useState('')
    /**
     * trata a funcao callback que recebe o id da forma selecionada
     * @param key id da forma selecionada
    */
    function onFormSelected(key: string) {
        setCurrentItem(PaymentStage.CONDICAO)
        setFormaId(key)
    }

    /**
     * trata a funcao callback que recebe o id da condicao selecionada
     * @param key id da condicao selecionada
     */
    function onTermSelected(key: string) {
        setCondicaoId(key)
        setCurrentItem(PaymentStage.PAGAMENTO)
    }


    return (
        <View style={commonStyle.common_columnItem}>
            <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                <Text onPress={() => setCurrentItem(PaymentStage.FORMA)}>Forma</Text>
                <Text>Condição</Text>
                <Text onPress={() => setCurrentItem(PaymentStage.PAGAMENTO)}>Pagamento</Text>
            </View>

            {/**esse ignore é porque o typescript estava achando que a comparação era nao intencional */}
            {/**@ts-ignore */}
            {currentItem === PaymentStage.FORMA && (
                <View style={[commonStyle.justify_content_space_evl, commonStyle.margin_8]}>
                    <ItemFormaPagamento onFormSelected={(key) => onFormSelected(key)} />
                </View>
            )}

            {/**@ts-ignore */}
            {currentItem === PaymentStage.CONDICAO && (
                <ItemCondicao onTermSelected={onTermSelected} formaId={formaId} />
            )}

            {/**@ts-ignore */}
            {currentItem === PaymentStage.PAGAMENTO && (
                <ItemPagamento paymentFormId={formaId} termId={condicaoId} />
            )}
        </View>
    )
}

/**
 * 
 * @param onFormSelected funcao de callback que ira retornar o valor da forma selecionada
 * para que consigamos fazer o usuário avançar para a proxima etapa 
 */
const ItemFormaPagamento = ({ onFormSelected, isEntrance = false }: { isEntrance?: boolean, onFormSelected: (key: string) => void }) => {
    /** guarda o id da forma de pagamento selecionada */
    const [selected, setSelected] = useState("");
    /** guarda a lista de pagamento */
    const [paymentsForm, setPaymentsForm] = useState<{ key: string, value: string }[]>();

    useEffect(() => {
        getFormaPagamento()
    }, [])

    /**
     * Funcao que busca as formas de pagamento
     */
    function getFormaPagamento() {
        try {
            handleGetListOfPaymentForm({ paymentForm: PaymentType.DINHEIRO }).then((res) => {
                if (res !== undefined) {
                    const transformedData = res.List!.map(item => ({
                        key: item.Id,
                        value: item.Value
                    }));
                    setPaymentsForm(transformedData)
                } else {
                    showToast(ToastType.ERROR, "Lista vazia", "Não foi possivel recuperar a forma de pagamento!")
                }
            })
        } catch (error: any) {
            showToast(ToastType.ERROR, "ERROR", error)
        }
    }

    return (
        <View>
            <SelectList
                placeholder="Escolha a forma de pagamento"
                /** key == a chave do valor que foi selecionada, a chave é mapeada para receber o ID do valor na funcao
                 * getFormaPagamento()
                 */
                setSelected={(key: string) => { setSelected(key) }}
                data={paymentsForm || [{}]}
                save="key"
            />
            {selected !== '' && !isEntrance && (
                <View style={[{ paddingHorizontal: 32 }, commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => onFormSelected(selected)}>
                        <Text style={commonStyle.btn_text_gray}>Continuar</Text>
                    </Pressable>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => setSelected('')}>
                        <Text style={commonStyle.btn_text_gray}>Cancelar</Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}

/**
 * 
 * @param formaId - chave da forma de pagamento selecionada 
 * @param onTermSelected é a funcao callback que ira levar para o componente pai o valor do id da condicao selecionada 
 * @returns 
 */
const ItemCondicao = ({ formaId, onTermSelected }: { formaId: string, onTermSelected: (key: string) => void }) => {
    /** guarda a lista de pagamento */
    const [paymentTerms, setPaymentTerms] = useState<{ key: string, value: string }[]>();

    useEffect(() => {
        getCondicaoPagamentoLista()
    }, [])

    /**
     * Funcao que busca as formas de pagamento
     */
    function getCondicaoPagamentoLista() {
        try {
            handleGetPaymentTermList({ paymentFormKey: formaId }).then((res) => {
                if (res !== undefined) {
                    const transformedData = res.List!.map(item => ({
                        key: item.Id,
                        value: item.Value
                    }));
                    setPaymentTerms(transformedData)
                } else {
                    showToast(ToastType.ERROR, "Lista vazia", "Não foi possivel recuperar a forma de pagamento!")
                }
            })
        } catch (error: any) {
            showToast(ToastType.ERROR, "ERROR", error)
        }
    }
    return (
        <View style={{ height: 140, borderWidth: 1, padding: 12, margin: 12, borderRadius: 20, borderColor: "#949494" }}>
            <FlatList data={paymentTerms}
                keyExtractor={(item) => item.key}
                renderItem={(item) => <RenderItemCondicao onTermSelected={(key) => onTermSelected(key)} id={item.item.key} title={item.item.value} />}
            />
        </View>
    )
}

/**
 * 
 * @param onTermSelected é a funcao callback que ira levar para o componente pai o valor do id da condicao selecionada 
 * @returns 
 */
const RenderItemCondicao = ({ id, title, onTermSelected }: { id: string, title: string, onTermSelected: (key: string) => void }) => {
    return (
        <View>
            <Pressable onPress={() => onTermSelected(id)}>
                <Text style={[commonStyle.margin_8, commonStyle.text_aligment_center]}>{title}</Text>
                <CustomSeparator />
            </Pressable>
        </View>
    )
}

const ItemPagamento = ({ paymentFormId, termId }: { paymentFormId: string, termId: string }) => {
    const [termItem, setTermItem] = useState<TermItem>()
    const [paymentValue, setPaymentValue] = useState('')


    useEffect(() => {
        getCondicaoPagamento()
    }, [])

    /**
     * Funcao que busca as formas de pagamento
     */
    function getCondicaoPagamento() {
        try {
            handleGetPaymentTerm({ paymentFormKey: paymentFormId, termId: termId }).then((res) => {
                if (res !== undefined) {
                    setTermItem(res)
                } else {
                    showToast(ToastType.ERROR, "Lista vazia", "Não foi possivel recuperar a forma de pagamento!")
                }
            })
        } catch (error: any) {
            showToast(ToastType.ERROR, "ERROR", error)
        }
    }


    return (
        <GestureHandlerRootView style={[commonStyle.common_columnItem, commonStyle.margin_8]}>
            <View>
                <Text style={[commonStyle.common_fontWeight_600, commonStyle.font_size_18]}>Pagamento</Text>
                <TextInput value={paymentValue} onChangeText={setPaymentValue} style={commonStyle.common_input} />

                {!termItem?.PermiteEntrada && (
                    <View>
                        <ItemFormaPagamento isEntrance={true} onFormSelected={(key: string) => { }} />
                        <Text style={[commonStyle.common_fontWeight_600, commonStyle.font_size_18]}>Valor Entrada</Text>
                        <TextInput value={paymentValue} onChangeText={setPaymentValue} style={commonStyle.common_input} />
                    </View>
                )}
                <View style={[{ paddingHorizontal: 32 }, commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => { }}>
                        <Text style={commonStyle.btn_text_gray}>Continuar</Text>
                    </Pressable>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => { }}>
                        <Text style={commonStyle.btn_text_gray}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        </GestureHandlerRootView>
    )
}

const ItemDetalhamento = () => {
    return (
        <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
            <Text>Forma</Text>
            <Text>Condição</Text>
            <Text>Pagamento</Text>
        </View>
    )
}

export default CS_SC_007_Pagamento;