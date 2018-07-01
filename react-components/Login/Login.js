import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation'; 
import globalStyles from '../styles'
import Spinner from 'react-native-loading-spinner-overlay';

export default class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            spinnerVisible: false
        }

        this.registerButtonPress = this.registerButtonPress.bind(this)
        this.loginButtonPress = this.loginButtonPress.bind(this)
    }

    registerButtonPress() {
        this.props.navigation.navigate('Register')
    }

    loginButtonPress() {
        this.setState({
            spinnerVisible: true
        })
        fetch("https://bonnie-api.dsys32.com/user/login/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
        .then((response) => {
            this.setState({
                spinnerVisible: false
            })
            if (response.status === 200) {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Menu' })],
                });
                this.props.navigation.dispatch(resetAction);
            } else {
                alert('error!')
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    
    render() {
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Spinner visible={this.state.spinnerVisible}/>
                <Text style={styles.bonniesText}>
                    bonnie's
                </Text>
                <View>
                    <View style={styles.loginTextInputView}>
                        <TextInput style={styles.loginTextInput}
                            underlineColorAndroid={'transparent'}
                            placeholder="email" 
                            placeholderTextColor="rgba(255, 255, 255, 0.6)" 
                            value={this.state.email} 
                            onChangeText={(email) => this.setState({email})}
                            textAlign= 'center'
                        >
                        </TextInput>
                    </View>
                    <View style={styles.loginTextInputView}> 
                        <TextInput style={styles.loginTextInput}
                            underlineColorAndroid={'transparent'}
                            placeholder="password" 
                            placeholderTextColor="rgba(255, 255, 255, 0.6)" 
                            value={this.state.password} 
                            onChangeText={(password) => this.setState({password})}
                            textAlign= 'center'
                            secureTextEntry= {true}
                        >
                        </TextInput>
                    </View>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={[globalStyles.roundedButton, styles.button]} onPress={this.registerButtonPress}>
                        <Text style={styles.buttonText}>
                            register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.roundedButton, styles.button]} onPress={this.loginButtonPress}>
                        <Text style={styles.buttonText}>
                            log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C5BFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bonniesText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        fontSize: 40,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    loginTextInput: {
        width: 250,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 20,
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    loginTextInputView: {
        backgroundColor: '#1A4AEC',
        margin: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsView: {
        marginTop: 130,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: '#FFFFFF',
        width: 130,
        height: 50,
        margin: 20
    },
    buttonText: {
        color: "rgba(66, 66, 66, 0.6)",
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20
    }
})