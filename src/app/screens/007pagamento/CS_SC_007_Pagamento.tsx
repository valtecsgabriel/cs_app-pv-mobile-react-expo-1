import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { commonStyle } from "../../CommonStyle";
import CustomCard_001 from "../../components/cards/CustomCard_001";
import CustomCard_003 from "../../components/cards/CustomCard_003";
import CustomIcon from "../../components/icon/CustomIcon";
import CustomSeparator from "../../components/lists/CustomSeparator";
import { TermItem } from "../../services/api/interfaces/pagamento/IResPaymentTerm";
import { IResGetPv } from "../../services/api/interfaces/prevenda/CS_Common_IPreVenda";
import { formatMoneyValue } from "../../util/FormatText";
import { ICON_NAME } from "../../util/IconsName";
import { ToastType, showToast } from "../../util/ShowToast";
import { handleGetListOfPaymentForm002, handleGetPaymentTerm, handleGetPaymentTermList, handleInsertPaymentForm } from "../../view_controller/pagamento/CS_PagamentoViewController";
import { handleGetPv } from "../../view_controller/prevenda/PreVendaViewController";
import { IReqInsertPaymentForm } from "../../services/api/interfaces/pagamento/CS_IReqInsertPaymentForm";
import { ItemListPaymentForm } from "../../services/api/interfaces/pagamento/IResListPaymentFormSaved";

const CS_SC_007_Pagamento = () => {
    const [currentPv, setCurrentPv] = useState<IResGetPv>()
    const [toDeleteForm, setToDeleteForm] = useState(false)
    function start() {
        try {
            handleGetPv().then((res) => {
                if (res !== undefined) {
                    setCurrentPv(res)
                } else {
                    showToast(ToastType.ERROR, "Algo deu errado!", "---")
                }
            })
        } catch (error: any) {
            showToast(ToastType.ERROR, "Algo deu errado!", error)
        }
    }

    useEffect(() => {
        start()
    }, [])


    function deletePaymentForm() {

    }

    return (
        <SafeAreaView>
            <TopOfScreen currentPv={currentPv?.Id} clientPv={currentPv?.Codigo + "-" + currentPv?.Nome_Cliente} />

            <CustomSeparator />

            <BuyValues TotalLiquido={currentPv?.TotalLiquido} Pagamento_ValorAPagar={currentPv?.Pagamento_ValorAPagar} Pagamento_ValorPago={currentPv?.Pagamento_ValorPago} />


            <CustomCard_003 children={<ItemSelecao />} />

            <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw, commonStyle.common_padding_16]}>
                <Text style={[commonStyle.common_fontWeight_800, { fontSize: 18 }]}>Detalhamento</Text>
                <CustomIcon icon={ICON_NAME.LIXEIRA} onPress={() => setToDeleteForm(!toDeleteForm)} />
            </View>

            <CustomCard_001 title="Forma    -    Condição    -    Valor" children={<ListDetalhamentoFormasPagamento toDeleteForm={toDeleteForm} deletePaymentForm={deletePaymentForm} />} />
        </SafeAreaView>
    );
}

const TopOfScreen = ({ currentPv, clientPv }: { currentPv?: string, clientPv: string }) => {

    return (
        <View>
            <Text style={[commonStyle.text_aligment_center, commonStyle.common_fontWeight_600, commonStyle.margin_8, commonStyle.font_size_18, { color: '#0A3147' }]}>{currentPv}</Text>
            <Text style={[commonStyle.text_aligment_center, commonStyle.font_size_16, { color: '#0A3147', fontWeight: 500 }]}>{clientPv}</Text>
        </View>
    )
}

const BuyValues = ({ TotalLiquido, Pagamento_ValorPago, Pagamento_ValorAPagar }: { TotalLiquido?: number, Pagamento_ValorPago?: number, Pagamento_ValorAPagar?: number }) => {
    return (
        <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw, commonStyle.margin_8]}>
            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Total da Compra
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, commonStyle.common_fontWeight_800, { color: '#0A3147' }]}>
                    {formatMoneyValue(TotalLiquido || 0)}
                </Text>
            </View>

            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Valor Pago
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, commonStyle.common_fontWeight_800, { color: '#0A3147' }]}>
                    {formatMoneyValue(Pagamento_ValorPago || 0)}
                </Text>
            </View>

            <View style={commonStyle.common_columnItem}>
                <Text style={[commonStyle.text_aligment_center, commonStyle.font_size_18, { color: '#0A3147' }]}>
                    Valor a Pagar
                </Text>
                <Text style={[commonStyle.text_aligment_center, , commonStyle.font_size_16, commonStyle.common_fontWeight_800, { color: '#0A3147' }]}>
                    {formatMoneyValue(Pagamento_ValorAPagar || 0)}
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
    const [currentStage, setCurrentStage] = useState(PaymentStage.FORMA)
    const [formaId, setFormaId] = useState('')
    const [condicaoId, setCondicaoId] = useState('')
    /**
     * trata a funcao callback que recebe o id da forma selecionada
     * @param key id da forma selecionada
    */
    function onFormSelected(key: string) {
        setCurrentStage(PaymentStage.CONDICAO)
        setFormaId(key)
    }

    /**
     * trata a funcao callback que recebe o id da condicao selecionada
     * @param key id da condicao selecionada
     */
    function onTermSelected(key: string) {
        setCondicaoId(key)
        setCurrentStage(PaymentStage.PAGAMENTO)
    }

    const stages = [
        { stage: PaymentStage.FORMA, number: 1, label: "Forma" },
        { stage: PaymentStage.CONDICAO, number: 2, label: "Condição" },
        { stage: PaymentStage.PAGAMENTO, number: 3, label: "Pagamento" }
    ];

    function finishPayment() {
        setCurrentStage(PaymentStage.FORMA)
    }


    return (
        <View style={commonStyle.common_columnItem}>
            {/** topo onde fica as colunas de forma, condicao e pagamento */}
            <View style={[commonStyle.common_columnItem, { padding: 16 }]}>
                <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                    {stages.map(({ stage, number, label }) => (
                        <View key={stage} style={{ alignItems: 'center' }}>
                            <Text style={[styles.number, stage === currentStage ? styles.active : {}]}>
                                {number}
                            </Text>
                            <Text style={[styles.text, stage === currentStage ? styles.active : {}]}>
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/**esse ignore é porque o typescript estava achando que a comparação era nao intencional */}
            {/**@ts-ignore */}
            {currentStage === PaymentStage.FORMA && (
                <View style={[commonStyle.justify_content_space_evl, commonStyle.margin_8]}>
                    <ItemFormaPagamento onFormSelected={(key) => onFormSelected(key)} />
                </View>
            )}

            {/**@ts-ignore */}
            {currentStage === PaymentStage.CONDICAO && (
                <ItemCondicao onTermSelected={onTermSelected} formaId={formaId} />
            )}

            {/**@ts-ignore */}
            {currentStage === PaymentStage.PAGAMENTO && (
                <ItemPagamento finishPayment={finishPayment} paymentFormId={formaId} termId={condicaoId} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    number: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#CED4DA',
    },
    text: {
        fontSize: 14,
        color: '#CED4DA',
    },
    active: {
        color: '#1068EB',
    },
});

const renderStageItem = (stage: PaymentStage, number: number, currentItem: PaymentStage) => (
    <View style={commonStyle.common_columnItem} key={number}>
        <View style={[{ borderWidth: 1, borderRadius: 32, padding: 8 }, currentItem === stage ? { borderColor: "#1068EB" } : { borderColor: "#CED4DA" }]}>
            <Text style={[
                commonStyle.common_fontWeight_600,
                commonStyle.text_aligment_center,
                currentItem === stage ? { color: "#1068EB" } : { color: "#CED4DA" }
            ]}>{number}</Text>
        </View>
    </View>
);

const renderStageLabel = (stage: PaymentStage, label: string, currentItem: PaymentStage) => (
    <Text style={[
        commonStyle.common_fontWeight_600,
        currentItem === stage ? { color: "#1068EB" } : { color: "#CED4DA" }
    ]} key={label}>{label}</Text>
);

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
        getFormaPagamento002()
    }, [])

    /**
      * Funcao que busca as formas de pagamento
      */
    function getFormaPagamento002() {
        try {
            handleGetListOfPaymentForm002().then((res) => {
                if (res !== undefined) {
                    const transformedData = res.csicp_bb026!.map(item => ({
                        key: item.ID,
                        value: item.BB026_FormaPagamento
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
            <View style={{ padding: 16 }}>
                <SelectList
                    placeholder="Escolha a forma de pagamento"
                    /** key == a chave do valor que foi selecionada, a chave é mapeada para receber o ID do valor na funcao
                     * getFormaPagamento()
                     */
                    setSelected={(key: string) => { setSelected(key) }}
                    data={paymentsForm || [{}]}
                    save="key"
                />
            </View>
            {selected !== '' && !isEntrance && (
                <View style={[{ paddingHorizontal: 32 }, commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => onFormSelected(selected)}>
                        <Text style={commonStyle.btn_text_gray}>Continuar</Text>
                    </Pressable>
                    <Pressable style={[commonStyle.btn_transparente]} onPress={() => setSelected('')}>
                        <Text style={commonStyle.btn_text_transparente}>Cancelar</Text>
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
                    //tem condicao de pagamento e ela nao e fixa?
                    if (res.formByIdWithConditions) {
                        const transformedData = res.formByIdWithConditions.FatoresAcrescimos!.map(item => ({
                            key: item.csicp_bb008.ID,
                            value: item.csicp_bb008.BB008_Condicao_Pagto
                        }));
                        setPaymentTerms(transformedData)
                    } else {
                        onTermSelected(res.formByIdWithFixConditions?.csicp_bb026.csicp_bb026.BB026_CondPagtoFixoID!)
                    }

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

const ItemPagamento = ({ paymentFormId, termId, finishPayment }: { paymentFormId: string, termId: string, finishPayment: () => void }) => {
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

    /** funcao para inserir forma de pagamento */
    function scInsertPaymentForm() {
        try {
            const iReqInsertPaymentForm: IReqInsertPaymentForm = {
                FormaPagamentoId: paymentFormId,
                CondicaoPagamentoId: termId,
                FormaPagamentoEntradaId: paymentFormId,
                Valor: Number(paymentValue),
                ValorEntrada: Number(paymentValue) - 1
            }
            handleInsertPaymentForm({ insertPaymentBody: iReqInsertPaymentForm }).then((res) => {
                if (res.IsOk) {
                    showToast(ToastType.SUCCESS, "Sucesso", res.Msg)
                } else {
                    showToast(ToastType.ERROR, "Erro", res.Msg)
                }
                finishPayment()
            })

        } catch (error: any) {
            showToast(ToastType.ERROR, error, "")
        }
    }


    return (
        <GestureHandlerRootView style={[commonStyle.common_columnItem, commonStyle.margin_8]}>
            <View>
                <Text style={[commonStyle.common_fontWeight_600, commonStyle.font_size_18]}>Pagamento</Text>
                <TextInput value={paymentValue} onChangeText={setPaymentValue} style={commonStyle.common_input} />

                {termItem?.PermiteEntrada && (
                    <View>
                        <ItemFormaPagamento isEntrance={true} onFormSelected={(key: string) => { }} />
                        <Text style={[commonStyle.common_fontWeight_600, commonStyle.font_size_18]}>Valor Entrada</Text>
                        <TextInput value={paymentValue} onChangeText={setPaymentValue} style={commonStyle.common_input} />
                    </View>
                )}
                <View style={[{ paddingHorizontal: 32 }, commonStyle.common_rowItem, commonStyle.justify_content_space_btw]}>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => scInsertPaymentForm()}>
                        <Text style={commonStyle.btn_text_gray}>Continuar</Text>
                    </Pressable>
                    <Pressable style={[commonStyle.btn_gray]} onPress={() => {
                        showToast(ToastType.INFO, "Cancelado", "Inserção de forma pagamento cancelada!")
                        finishPayment()
                    }}>
                        <Text style={commonStyle.btn_text_gray}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        </GestureHandlerRootView>
    )
}

const ListDetalhamentoFormasPagamento = ({ list, toDeleteForm, deletePaymentForm }: { list: ItemListPaymentForm[], toDeleteForm: boolean, deletePaymentForm: () => void }) => {
    return (
        <View>
            <FlatList
                data={list}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={({ item }) => <ItemDetalhamento toDeleteForm={toDeleteForm} deletePaymentForm={deletePaymentForm} />}
            />
        </View>
    )
}

/**
 * Item de detalhamento
 */
const ItemDetalhamento = ({ toDeleteForm, deletePaymentForm }: { toDeleteForm: boolean, deletePaymentForm: () => void }) => {
    return (
        <View style={[commonStyle.common_rowItem, commonStyle.justify_content_space_btw, commonStyle.common_padding_16, toDeleteForm && { backgroundColor: "#141414CC" }]}>
            <Text>DINHEIRO</Text>
            {toDeleteForm ? <CustomIcon icon={ICON_NAME.LIXEIRA} iconColor="#FFF" iconSize={24} onPress={() => deletePaymentForm()} /> : <Text>XXXXXXXX</Text>}
            <Text>{formatMoneyValue(12.9)} </Text>
        </View>
    )
}

export default CS_SC_007_Pagamento;