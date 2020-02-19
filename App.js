/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text, TouchableOpacity,
    View,
    FlatList
} from 'react-native';
console.disableYellowBox = true;

class App extends Component {

    socket: null;

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            connected: false,
            connectionStatus: '...Connecting',
            mRandomNumber:this.getRandomNumber(),
            mList:[]
        };
        this.socket = new WebSocket('wss://echo.websocket.org/');
        this.socket.onopen = () => {
            this.setState({connected: true});
        };

    }

    componentDidMount(): void {
        this.registerSocketListener();
    }

    componentWillUnmount () {
        this.socket.close()
    }

    getRandomNumber=()=>{
        return(`${Math.random()}`.replace(".",""))
    }

    registerSocketListener = () => {
        this.socket.onopen = () => {
            this.setState({connected:true,connectionStatus:'Open'})
        }
        this.socket.onmessage = (event) => {
           this.setState({mList:[...this.state.mList,event.data]})
        }
        this.socket.onerror = (error) => {
            this.setState({connectionStatus:'Error'}) }
        this.socket.onclose = () => {
            this.setState({connectionStatus:'Close'})

        }

    }

    sendData=()=> {
        if (this.state.connected) {
            this.socket.send(`${this.state.mRandomNumber}`);
        }
    }

    renderItem=(data)=>{
        return(
            <Text style={[styles.randomNumberText,{textAlign: 'left',color: 'teal',marginTop: 8}]} >{`${data.item}`}</Text>
        )
    }


    renderConnectionStatus=()=>{
        const {connectionStatus}=this.state
        return(
            <Text style={[styles.randomNumberText,{textAlign: 'left',color: 'teal',marginTop: 8}]} >{`Live Connection Status::${connectionStatus}`}</Text>
        )

    }

    render() {
        const {mList,mRandomNumber}=this.state
        return (
            <>
                <StatusBar barStyle="dark-content"/>
                <SafeAreaView style={styles.container}>
                   <View style={styles.btnContainer}>
                       <TouchableOpacity style={[styles.btnWrapper,{marginRight: '2%'}]} onPress={this.sendData}>
                           <Text style={styles.btnText}>Send To Server</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.btnWrapper} onPress={()=>this.setState({mRandomNumber:this.getRandomNumber()})}>
                           <Text style={styles.btnText}>Genrate Random Number</Text>
                       </TouchableOpacity>
                   </View>


                        <Text style={styles.heading}>{` Genrated Number`}</Text>
                        <Text style={styles.randomNumberText}>{` ${mRandomNumber}`}</Text>

                        <FlatList
                            data={mList}
                            keyExtractor={(item)=>item}
                            renderItem={(data) => this.renderItem(data)}/>

                    {this.renderConnectionStatus()}

                </SafeAreaView>
            </>
        );
    }
}

const styles = {
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'lightgrey',
        flex: 1
    },btnWrapper:{
        backgroundColor: '#555555',
        borderRadius: 4,
        padding: 10,
        minWidth: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
    },btnText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 14
    },btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },heading: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
        marginTop:15
    },randomNumberText: {
        marginTop: 5,
        fontSize:14,
        lineHeight: 14,
        textAlign: 'center',
    }
}

export default App;

