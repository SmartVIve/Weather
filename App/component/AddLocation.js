import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableHighlight,
    StatusBar
} from 'react-native';

export default class AddLocation extends Component {
    static navigationOptions = {
        title: '添加地址',
    };

    constructor(props) {
        super(props)
        this.state = {inputText: '', data: ''}
    }

    async _onTextChange(text) {
        try {
            let response = await fetch('https://search.heweather.com/find?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=' + text);
            let json = await response.json();
            if (json.HeWeather6[0].status === 'ok') {
                this.setState({inputText: text, data: json.HeWeather6[0].basic});
            }else {
                this.setState({inputText: text, data: ''});
            }

        } catch (error) {

        }

    }

    render() {
        const {navigate,goBack,state} = this.props.navigation;
        return (
            <View style={styles.textInputBg}>
                <StatusBar translucent={false} barStyle="dark-content"/>
                <TextInput style={styles.textInput} placeholder="输入城市" underlineColorAndroid="transparent"  onChangeText={(text) => this._onTextChange(text)}/>
                <View style={styles.separator}/>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={()=><View style={styles.separator}/>}
                    renderItem={({item}) =>
                        <View>
                            <TouchableHighlight style={styles.itemBg} underlayColor="#DDDDDD" onPress={()=>{state.params.callback(item.location);goBack()}}>
                                    <Text style={styles.item} >{item.admin_area}-{item.parent_city}-{item.location}</Text>
                            </TouchableHighlight>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInputBg:{
        backgroundColor:"#efeff4"
    },
    textInput:{
        height:40,
        marginLeft:16,
        marginRight:16,
        marginTop:8,
        marginBottom:8,
        borderWidth:1,
        borderColor:"#DDDDDD",
        borderRadius:8,
        backgroundColor:"white"
    },
    item:{
        flex:1,
        marginLeft:24,
        marginRight:24,
        marginTop:16,
        marginBottom:16,
        fontSize:16
    },
    itemBg:{
        backgroundColor:"white"
    },
    separator:{
        height:1,
        backgroundColor:"#d6d7dc",
        opacity:0.5,
    }
});