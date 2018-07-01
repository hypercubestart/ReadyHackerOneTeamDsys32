import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Keyboard } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import globalStyles from '../styles'
import Spinner from 'react-native-loading-spinner-overlay';

const BUTTONS_VIEW_NO_KEYBOARD_MARGIN_BOTTOM = 20
const BUTTONS_VIEW_KEYBOARD_MARGIN_BOTTOM = 300
const ANIMATION_TIME = 100 //ms

export default class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            password: '',
            password_mask: true,
            spinnerVisible: false
        }

        this.backButtonPressed = this.backButtonPressed.bind(this)
        this.registerButtonPressed = this.registerButtonPressed.bind(this)
        this._keyboardDidShow = this._keyboardDidShow.bind(this)
        this._keyboardDidHide = this._keyboardDidHide.bind(this)

        this.buttonsViewMarginBottom = new Animated.Value(BUTTONS_VIEW_NO_KEYBOARD_MARGIN_BOTTOM)
    }

    backButtonPressed() {
        this.props.navigation.goBack()
    }

    componentDidMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    
    _keyboardDidShow () {
        Animated.timing(this.buttonsViewMarginBottom, {
            duration: ANIMATION_TIME,
            toValue: BUTTONS_VIEW_KEYBOARD_MARGIN_BOTTOM,
        }).start()
    }
    
    _keyboardDidHide () {
        Animated.timing(this.buttonsViewMarginBottom, {
            duration: ANIMATION_TIME,
            toValue: BUTTONS_VIEW_NO_KEYBOARD_MARGIN_BOTTOM,
        }).start()
    }

    registerButtonPressed() {
        this.setState({
            spinnerVisible: true
        })
        fetch("https://bonnie-api.dsys32.com/user/register/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }),
        })
        .then((response) => {
            this.setState({
                spinnerVisible: false
            })
            if (response.status === 200) {
                this.props.navigation.goBack()
            } else {
                alert('error!')
            }
        })
        .catch((error) =>{
            alert('error!')
            console.error(error);
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <Spinner visible={this.state.spinnerVisible}/>
                <View style={styles.header}>
                    <MaterialIcons name="arrow-back" style={globalStyles.backButton} onPress={this.backButtonPressed}/>
                    <Text style={[globalStyles.headerText, {paddingLeft: 20}]}>
                        register
                    </Text>
                </View>

                <View style={styles.textInputsView}>
                    <TextInput style={[styles.registerTextInput, {marginLeft: 55}]}
                        underlineColorAndroid={'transparent'}
                        placeholder="name" 
                        placeholderTextColor="#7092EA" 
                        value={this.state.name} 
                        onChangeText={(name) => this.setState({name})}
                    />
                    <TextInput style={[styles.registerTextInput, {marginLeft: 55}]}
                        underlineColorAndroid={'transparent'}
                        placeholder="email" 
                        placeholderTextColor="#7092EA" 
                        value={this.state.email} 
                        onChangeText={(email) => this.setState({email})}
                    />
                    <View style={styles.passwordView}>
                        <MaterialCommunityIcons name={this.state.password_mask ? "eye" : "eye-off"} 
                                                style={styles.passwordMaskButton}
                                                onPress={() => this.setState({ password_mask: !this.state.password_mask })}/>
                        <TextInput style={[styles.registerTextInput, {marginLeft: 25}]}
                            underlineColorAndroid={'transparent'}
                            placeholder="password" 
                            placeholderTextColor="#7092EA" 
                            value={this.state.password} 
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry= {this.state.password_mask}
                        />
                    </View>
                </View>

                <Animated.View style={{alignContent: 'center', flexDirection: 'row', justifyContent: 'space-around', marginBottom: this.buttonsViewMarginBottom,}}>
                    <TouchableOpacity style={[globalStyles.roundedButton, styles.getStartedButton]} onPress={this.registerButtonPressed}>
                        <Text style={styles.getStartedText}>
                            get started
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    header: {
        flexDirection: 'row',
        marginTop: 40,
        marginLeft: 40,
        alignItems: 'center'
    },
    registerTextInput: {
        color: "#7092EA",
        fontSize: 30,
        width: 230,
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
    },
    textInputsView: {
        alignItems: 'flex-start',
        marginTop: 30,
        flex: 1,
        marginLeft: 40,
    },
    passwordView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    passwordMaskButton: {
        fontSize: 30,
        color: "#7092EA"
    },
    getStartedButton: {
        backgroundColor: "#1C5BFF",
        width: 200,
        height: 50,
    },
    getStartedText: {
        color: "#FDFDFD",
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20
    }
})