import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import Swipeout from 'react-native-swipeout';


export default class NavigationView extends Component {
    constructor(props) {
        super(props);
        this.state={open:''}
    }


    _swipeOutBtn(item) {
        return [
            {
                type: 'delete',
                onPress: () => {
                    this.props.removeLocation(item)
                },
                // 自定义component
                component: [
                    <View style={styles.swipeoutBtns}>
                        <Text style={styles.swipeoutText}>删除</Text>
                    </View>
                ],
            }
        ];
    }


    async _weather(location) {
        //七天
        let response = await fetch("https://free-api.heweather.com/s6/weather/forecast?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=" + location);
        let json = await response.json();
        let tmp_min = json.HeWeather6[0].daily_forecast[0].tmp_min;
        let tmp_max = json.HeWeather6[0].daily_forecast[0].tmp_max;
        console.log(tmp_max);
        this.setState({weather:tmp_min + '~' + tmp_max + '℃'});
    }




    render() {
        return (
            <View style={styles.main}>
                <Image style={styles.bg} source={require('../images/menubg.jpg')}/>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("AddLocation", {
                    callback: (location) => {
                        //添加地址返回
                        this.props.addLocation(location);
                    }
                })}>
                    <View style={styles.textView}>
                        <Text style={styles.text}>添加城市</Text>
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.separator}/>
                <FlatList
                    data={this.props.locationList}
                    extraData={[this.props.weather,this.state.open]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item,index}) =>
                        <Swipeout
                            refs='swipout'
                            close={!(this.state.open === item)}
                            onOpen={()=>{this.setState({open:item})}}
                            autoClose={true}
                            left={this._swipeOutBtn(item)}>
                            <TouchableNativeFeedback onPress={() => {this.props.addLocation(item)}}>
                                <View style={styles.textView}>
                                    <Text style={styles.text}>{item}</Text>
                                    {this.props.weather[0][item] === undefined ? null :
                                        <View style={styles.weatherContainer}>
                                            <Text>{this.props.weather[0][item].tmp}</Text>
                                            <Image style={styles.weatherIcon} source={{uri:'https://cdn.heweather.com/cond_icon/'+this.props.weather[0][item].cond+'.png'}}/>
                                        </View>}
                                </View>
                            </TouchableNativeFeedback>
                        </Swipeout>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "white"
    },
    bg: {
        width: 300,
        height: 206
    },
    textView: {
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white"
    },
    text: {
        flex: 1,
        fontSize: 18
    },

    swipeoutBtns: {
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },

    swipeoutText: {
        color: "white",
        fontSize: 16,
    },
    weatherContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    weatherIcon:{
        width:24,
        height:24,
        marginLeft:8,
    },
    separator:{
        height:1,
        backgroundColor:"#DDDDDD",
        opacity:0.5,
    }
});