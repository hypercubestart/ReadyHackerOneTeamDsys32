import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native'
import globalStyles from '../styles'
import CheckoutItem from '../Checkout/CheckoutItem'
import Spinner from 'react-native-loading-spinner-overlay';


export default class OrderConfirmation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadingUserData: true,
            order_id: this.props.navigation.getParam('order_id', ''),
            order: this.props.navigation.getParam('order', [])
        }

    }

    componentDidMount() {
        this.getUserInfo().then(function(responseJson) {
            this.setState({
                isLoadingUserData: false,
                user: responseJson
            })
        }.bind(this))
    }

    async getUserInfo() {
        try {
            let response = await fetch(
                "https://bonnie-api.dsys32.com/user/get/"
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Spinner visible={this.state.isLoadingUserData}/>
                <View style={styles.header}>
                    <Text style={globalStyles.headerText}>
                        confirmation
                    </Text>
                </View>

                {
                    !this.state.isLoadingUserData && (
                        <View style={styles.innerContainer}>
                            <View>
                                <Text style={[styles.subItemText, {color: '#000000'}]}>
                                    personal info
                                </Text>
                            </View>
                            <View style={{marginTop: 15, marginBottom: 15}}>
                                <Text style={[styles.subItemText, {color: '#1C5BFF'}]}>
                                    {this.state.user.name}
                                </Text>
                                <Text style={[styles.subItemText, {color: '#1C5BFF'}]}>
                                    {this.state.user.email}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.subItemText, {color: '#000000'}]}>
                                    summary
                                </Text>
                            </View>
                            <FlatList
                                style={{marginTop: 10, marginBottom: 30}}
                                data={this.state.order}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item}) => <CheckoutItem item={item}></CheckoutItem>}
                            />
                            <View style={styles.footerView}>
                                <Text style={styles.orderIdText}>
                                    {'order id: ' + this.state.order_id.slice(0,6)}
                                </Text>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'   
    },
    header: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 95,
        alignItems: 'center'
    },
    innerContainer: {
        marginLeft: 60,
        flex: 1,
        marginTop: 20
    },
    subItemText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 25,
    },
    footerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    orderIdText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#000000'
    }
})