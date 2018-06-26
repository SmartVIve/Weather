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
            location: '',
            locationList: '',
            lastLocation:'',
            tmp: '',
            cond: '',
            forecast: '',
            hourly: '',
            weather:[{}]
        };


        AsyncStorage.getItem('lastLocation',(error,result)=>{
           if (!error){
               if (result === null){
                   this.setState({location:'北京'})
               }else {
                   this.setState({location:result})
               }
               //刷新数据
               this._onRefresh();
           }
        });

        //读取城市列表
        AsyncStorage.getItem('locationList', (error, result) => {
            if (!error) {
                if (result === null || result === '[]'){
                    this.setState({locationList:['北京']})
                    this.locationListWeather('北京')
                }else {
                    this.setState({locationList: JSON.parse(result)},()=>{
                        this.state.locationList.map((location)=>{
                            this.locationListWeather(location)
                        })
                    })
                }
            }
        });

    }

    //抽屉栏天气获取
    async locationListWeather(location) {
        //七天
        let response = await fetch("https://free-api.heweather.com/s6/weather/forecast?parameters&key=aaf8efc299ca4d5ebeb402a73c69accd&location=" + location);
        let json = await response.json();
        let tmp_min = json.HeWeather6[0].daily_forecast[0].tmp_min;
        let tmp_max = json.HeWeather6[0].daily_forecast[0].tmp_max;
        let cond = json.HeWeather6[0].daily_forecast[0].cond_code_d;
        let weather = this.state.weather.slice(0);
        let city =json.HeWeather6[0].basic.location;
        weather[0][city] = {tmp:tmp_min + '~' + tmp_max + '℃',cond:cond};
        this.setState({weather:weather});
        //console.log(this.state.weather)
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
        }finally {
            AsyncStorage.setItem('lastLocation',this.state.location);
        }
    }

    //添加地址
    addLocation(location) {
        this.setState({location: location}, () => {
            this.refs.drawer.closeDrawer();
            this._onRefresh();
        });
        let [...locationList] = this.state.locationList;
        if (locationList.indexOf(location) === -1) {
            locationList.push(location);
            this.setState({locationList: locationList},()=>{
                this.state.locationList.map((location)=>{
                    this.locationListWeather(location)
                })
            });
            this.saveLocation(locationList);
        }
    }

    //删除地址
    removeLocation(location){
        let [...locationList] = this.state.locationList;
        let index = locationList.indexOf(location);
        if (index !== -1) {
            locationList.splice(index,1);
            this.setState({locationList:locationList});
            this.saveLocation(locationList);
        }
    }

    //保存地址
    saveLocation(locationList){
        let data = JSON.stringify(locationList);
        AsyncStorage.setItem('locationList', data, (error) => {
            if (error) {
                console.log('fail');
            } else {
                console.log('success');
            }
        });
    }




    render() {
        return (
            <DrawerLayout
                ref='drawer'
                drawerWidth={300}
                drawerPosition={DrawerLayout.positions.Left}
                onDrawerClose={()=>this.navigationView.setState({open:''})}
                renderNavigationView={() =>
                    <NavigationView
                        ref={(c)=>{this.navigationView = c}}
                        locationList={this.state.locationList}
                        weather={this.state.weather}
                        addLocation={(location) => {this.addLocation(location)}}
                        removeLocation={(location)=>{this.removeLocation(location)}}
                        navigation={this.props.navigation}/>}>
                <StatusBar translucent={true} backgroundColor="transparent"/>
                <Image ref='image' style={styles.bg} source={require('./images/bg.jpg')}/>
                <View style={styles.content}>
                    <Header title={this.state.location} onPress={() => {this.refs.drawer.openDrawer()}}/>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}/>
                        }>

                    {this.state.error === '' ? (
                       <View>
                            <Text style={styles.tmp}>{this.state.tmp}</Text>
                            <Text style={styles.cond}>{this.state.cond}</Text>
                            <Hourly hourly={this.state.hourly}/>
                            <Forecast forecast={this.state.forecast}/>
                       </View>
                    ) : (
                            <Text style={styles.error}>{this.state.error}</Text>
                    )}

                    </ScrollView>
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
    scrollView:{
        width:width
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