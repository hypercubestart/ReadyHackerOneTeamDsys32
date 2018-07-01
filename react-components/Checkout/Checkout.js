import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import globalStyles from '../styles'
import Spinner from 'react-native-loading-spinner-overlay';
import CheckoutItem from './CheckoutItem'
import { NavigationActions, StackActions } from 'react-navigation'; 

export default class Checkout extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadingUserData: true,
            isPlacingOrder: false,
            user: {},
            order: this.parseOrder(this.props.navigation.getParam('order', []))
        }

        this.placeOrder = this.placeOrder.bind(this)
    }

    placeOrder() {
        this.setState({
            isPlacingOrder: true
        })
        fetch("https://bonnie-api.dsys32.com/order/place/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: this.state.order,
            }),
        }).then((response) => {
            this.setState({
                isPlacingOrder: false
            })
            if (response.status === 200) {
                response.json().then((responseJson) => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'OrderConfirmation', params: {
                            order_id: responseJson._id,
                            order: this.state.order
                        } })],
                    });
                    this.props.navigation.dispatch(resetAction);
                })
            } else {
                alert('error!')
            }
        }).catch(() => {

        })
    }

    parseOrder(order) {
        //object -> array of orders
        var orderArray = []
        for(var key in order) {
            orderArray.push(order[key])
        }
        return orderArray
    }

    componentDidMount() {
        this.getUserInfo().then(function(responseJson) {
            this.setState({
                isLoadingUserData: false,
                user: responseJson
            })
        }.bind(this))
    }

    getTotalCost() {
        var cost = 0
        for (var i = 0; i < this.state.order.length; i++) {
            cost += parseFloat(this.state.order[i].price) * parseInt(this.state.order[i].quantity)
        }
        return cost.toFixed(2)
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
                <Spinner visible={this.state.isLoadingUserData || this.state.isPlacingOrder}/>
                <View style={styles.header}>
                    <Text style={globalStyles.headerText}>
                        check out
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
                                <Text style={styles.totalCostText}>
                                    {'$' + this.getTotalCost()}
                                </Text>
                                <TouchableOpacity style={[globalStyles.roundedButton, styles.confirmationButton]} onPress={this.placeOrder}>
                                    <Text style={styles.confirmText}>
                                        confirm
                                    </Text>
                                </TouchableOpacity>
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
    totalCostText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#000000'
    },
    confirmationButton: {
        backgroundColor: '#14DB88',
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 50
    },
    confirmText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000000'
    }
})