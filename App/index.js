import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    FlatList,
    ScrollView,
    RefreshControl,
    Dimensions,
    Image,
    StatusBar,
    TouchableNativeFeedback,
    AsyncStorage
} from 'react-native';
import DrawerLayout from 'react-native-drawer-layout'
import {createStackNavigator, StackNavigator, DrawerNavigator} from "react-navigation"
import Header from './component/Header'
import Hourly from './component/Hourly'
import Forecast from './component/Forecast'
import AddLocation from './component/AddLocation'
import NavigationView from './component/NavigationView'

type Props = {};

class Weather extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: true,
            error: '',
            location: '北京',
            locationItem: '',
            tmp: '',
            cond: '',
            forecast: '',
            hourly: ''
        };
        this._onRefresh();

        //读取储存数据
        AsyncStorage.getItem('location', (error, result) => {
            if (!error) {
                if (result === null){
                    this.setState({locationItem:['北京']})
                }else {
                    this.setState({locationItem: JSON.parse(result)})
                }
            }
        });
    }

    //刷新
    async _onRefresh() {
        this.setState({isRefreshing: true});
        try {
            //实况
            let nowResponse = await fetch("https://free-api.heweather.com/s6/weather/now?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=" + this.state.location);
            let nowJson = await nowResponse.json();

            //七天
            let forecastResponse = await fetch("https://free-api.heweather.com/s6/weather/forecast?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=" + this.state.location);
            let forecastJson = await forecastResponse.json();

            //逐小时
            let hourlyResponse = await fetch("https://free-api.heweather.com/s6/weather/hourly?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=" + this.state.location);
            let hourlyJson = await hourlyResponse.json();

            if (nowJson.HeWeather6[0].status === 'ok' && forecastJson.HeWeather6[0].status === 'ok' && hourlyJson.HeWeather6[0].status === 'ok') {
                let tmp = nowJson.HeWeather6[0].now.tmp;
                let cond = nowJson.HeWeather6[0].now.cond_txt;
                let forecastData = forecastJson.HeWeather6[0].daily_forecast;
                let hourlyData = hourlyJson.HeWeather6[0];
                this.setState({
                    tmp: tmp + "°",
                    cond: cond,
                    forecast: forecastData,
                    hourly: hourlyData,
                    error: '',
                    isRefreshing: false
                });
            } else {
                this.setState({error: '连接错误', isRefreshing: false});
            }
        } catch (error) {
            console.log("error" + error);
            this.setState({error: error.toString(), isRefreshing: false});
        }
    }

    addLocation(location) {
        this.setState({location: location}, () => {
            this.refs.drawer.closeDrawer();
            this._onRefresh();

            let locationItem = this.state.locationItem;
            if (locationItem.indexOf(location) === -1) {
                locationItem.push(location);
                console.log(locationItem);
                this.setState({locationItem: locationItem});
                let data = JSON.stringify(locationItem);
                AsyncStorage.setItem('location', data, (error) => {
                    if (error) {
                        console.log('fail');
                    } else {
                        console.log('success');
                    }
                });
            }
        })
    }


    render() {
        //获取屏幕宽高
        const {width, height} = Dimensions.get('window');


        return (
            <DrawerLayout
                ref='drawer'
                drawerWidth={300}
                drawerPosition={DrawerLayout.positions.Left}
                renderNavigationView={() =>
                    <NavigationView locationItem={this.state.locationItem}
                                       addLocation={(location) => {this.addLocation(location)}}
                                       navigation={this.props.navigation}/>}>
                <StatusBar translucent={true} backgroundColor="transparent"/>
                <Image style={styles.bg} source={require('./images/bg_0.jpg')}/>
                <View style={styles.content}>
                    <Header title={this.state.location} onPress={() => this.refs.drawer.openDrawer()}/>

                    {this.state.error === '' ? (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}/>
                            }>
                            <Text style={styles.tmp}>{this.state.tmp}</Text>
                            <Text style={styles.cond}>{this.state.cond}</Text>
                            <Hourly hourly={this.state.hourly}/>
                            <Forecast forecast={this.state.forecast}/>
                        </ScrollView>
                    ) : (
                        <Text style={styles.error}>{this.state.error}</Text>
                    )}

                </View>
            </DrawerLayout>
        )
    }
}


export default StackNavigator({
    Home: {
        screen: Weather,
    },
    AddLocation: {
        screen: AddLocation,
        navigationOptions: (navigation) => ({
            title: '添加城市',
        })
    }
});

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    content: {
        position: 'absolute',
        top: 25,
        bottom: 0,
    },
    error: {
        width: width,
        marginTop: height / 3,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        color: "white"
    },
    bg: {
        width: null,
        height: null,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tmp: {
        textAlign: "center",
        fontSize: 88,
        color: "white",
        marginTop: height / 8
    },
    cond: {
        textAlign: "center",
        fontSize: 20,
        color: "white",
        marginBottom: height / 8
    },

});