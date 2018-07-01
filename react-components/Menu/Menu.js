import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import globalStyles from '../styles'
import MenuItem from './MenuItem'

export default class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadingMenu: true,
            menu: [],
            order: {},
            user: {}
        }

        this.onSelectItem = this.onSelectItem.bind(this)
        this.increaseQuantity = this.increaseQuantity.bind(this)
        this.decreaseQuantity = this.decreaseQuantity.bind(this)
        this.goToCheckOut = this.goToCheckOut.bind(this)
        this.inPreviousOrder = this.inPreviousOrder.bind(this)
    }

    goToCheckOut() {
        this.props.navigation.navigate('Checkout', {
            order: this.state.order
        })
    }

    inPreviousOrder(item_id) {
        if (this.state.user.previousOrders === undefined || this.state.user.previousOrders.length === 0) return false;
        var mostRecentOrder = this.state.user.previousOrders[this.state.user.previousOrders.length - 1]

        if (mostRecentOrder === null) return false

        for (var i = 0 ; i < mostRecentOrder.items.length; i++) {
            if (mostRecentOrder.items[i]._id === item_id) {
                return true
            }
        }
        return false
    }

    onSelectItem(item) {
        let order = Object.assign({}, this.state.order);
        if (this.state.order[item._id] === undefined) {
            //add item to current order
            order[item._id] = {...item, quantity: 1}
        } else {
            //remove item from current order
            delete order[item._id]
        }
        this.setState({
            order
        })
    }

    increaseQuantity(item) {
        let order = Object.assign({}, this.state.order);
        order[item._id].quantity++
        this.setState({
            order
        })
    }

    decreaseQuantity(item) {
        let order = Object.assign({}, this.state.order);
        if (order[item._id].quantity === 1) {
            delete order[item._id]
        } else {
            order[item._id].quantity--
        }
        this.setState({
            order
        })
    }

    isOrderEmpty() {
        for (var key in this.state.order) {
            return false
        }
        return true
    }

    componentDidMount() {
        Promise.all([this.getMenu(), this.getUserInfo()]).then(function(values) {
            this.setState({
                isLoadingMenu: false,
                menu: values[0],
                user: values[1]
            })
            console.log(values[0])
        }.bind(this))
    }

    async getMenu() {           
        try {
            let response = await fetch(
                "https://bonnie-api.dsys32.com/item/get/"
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error);
        }
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
        const menu = {'Appetizers': [], 'Entrees': [], 'Desserts': []}
        this.state.menu.forEach(function(item, val) {
            menu[item.category].push(item)
        })
        return(
            <View style={styles.container}>
                <Spinner visible={this.state.isLoadingMenu}/>

                <View style={styles.header}>
                    <Text style={globalStyles.headerText}>
                        menu
                    </Text>
                </View>

                <FlatList
                    style={{marginBottom: 50}}
                    data={menu.Appetizers.concat(menu.Entrees).concat(menu.Desserts)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {

                            let groupString = ""
                            if (index === 0) {
                                groupString = "appetizers"
                            } else if (index === menu.Appetizers.length) {
                                groupString = "entrees"
                            } else if (index === menu.Appetizers.length + menu.Entrees.length) {
                                groupString = "desserts"
                            } 

                            if (this.state.order[item._id] !== undefined) {
                                return <MenuItem item={item} 
                                            startGroup={groupString} 
                                            selected={this.state.order[item._id] !== undefined} 
                                            onSelectItem={this.onSelectItem}
                                            quantity={this.state.order[item._id].quantity}
                                            increaseQuantity={this.increaseQuantity}
                                            decreaseQuantity={this.decreaseQuantity}
                                            recommended={this.inPreviousOrder(item._id)}
                                            />
                            }
                            return <MenuItem item={item} 
                                            startGroup={groupString} 
                                            selected={this.state.order[item._id] !== undefined} 
                                            onSelectItem={this.onSelectItem}
                                            increaseQuantity={this.increaseQuantity}
                                            decreaseQuantity={this.decreaseQuantity}
                                            recommended={this.inPreviousOrder(item._id)}
                                            />
                            
                        }
                    }
                />
            
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity style={[globalStyles.roundedButton, styles.nextButton, {backgroundColor: this.isOrderEmpty() ? '#7f8c8d' : '#1C5BFF'}]} onPress={this.goToCheckOut} disabled={this.isOrderEmpty()}>
                        <Text style={styles.checkOutText}>
                            next: check out
                        </Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: 40,
        marginLeft: 95,
        alignItems: 'center'
    },
    nextButton: {
        width: 200,
        height: 40,
        marginBottom: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkOutText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FDFDFD',
    }
})