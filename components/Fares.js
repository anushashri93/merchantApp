import React, { Component } from 'react';
import {ScrollView, Text, StyleSheet, View, RefreshControl} from 'react-native';
import {faresDetails} from '../constants/constants'

export default class Fares extends Component {
  constructor() {
    super();
    this.state = {
      faresDetails,
      nextBillingDate : '',
      refreshing: false
    }
  }
  static navigationOptions = {
    title: "Fares"
  }

  componentWillMount() {

    // To Calulate Next billing Date
    this.calculateNextBillingDate();
    
    //ajax call for fares details  
  }

  calculateNextBillingDate = () => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Getting The Date for Next Sunday
    let td = new Date();
    let diffDays = 7-td.getDay();
    let nextDate = new Date(td.setDate(td.getDate() + diffDays));
    
    // Constructing the Date Object
    let nextSundayDate = `${nextDate.getDate()} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()}` 

    this.setState({
      nextBillingDate : nextSundayDate
    })  
  }

  outstandingAmounts = () => {
    let creditAmount = 0 , debitAmount = 0;
    for (var i = 0; i < this.state.faresDetails.length; i++) {
      if(this.state.faresDetails[i].type) {
        debitAmount +=  this.state.faresDetails[i].amount * 0.1
      } else {
        creditAmount +=  this.state.faresDetails[i].amount * 0.9
      }
    }
    return [creditAmount,debitAmount];
  }

  calculateFare = (amount,type) => {
    if(type){
      return amount*0.1
    } else {
      return amount*0.9
    }
  }

   // To Refresh the component
  _onRefresh = () => {
    let reactNativeInstance = this;
    this.setState({
        refreshing: true
    },() => {
      // To update the API call and set the state as false when succesful
        this.setState({
          refreshing: false
        })
    });

  }
  render() {
    return (
      <ScrollView
          refreshControl={
      <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
      />
    } 
      >
        <View style = {styles.fareContainer}>
          <View style={styles.totalAmount}>
            <View style={styles.innerContainer}>
              <Text style={styles.innerText}>Total Amount To be Credited</Text>
            </View>
            <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
              <Text style={[styles.innerText,{color: "green"}]}>+{this.outstandingAmounts()[0]}</Text>
            </View>
          </View>
          <View style={[styles.totalAmount,{borderTopWidth: 0}]}>
            <View style={styles.innerContainer}>
              <Text style={styles.innerText}>Total Amount To be Debited</Text>
            </View>
            <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
              <Text style={[styles.innerText,{color: "red"}]}>-{this.outstandingAmounts()[1]}</Text>
            </View>
          </View>
          <View style={[styles.totalAmount,{borderTopWidth: 0,marginBottom: 20}]}>
            <View style={styles.innerContainer}>
              <Text style={styles.innerText}>Total Amount</Text>
            </View>
            <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
              <Text style={styles.innerText}>{this.outstandingAmounts()[0]-this.outstandingAmounts()[1]}</Text>
            </View>
          </View>
          <View style={[styles.totalAmount]}>
            <View style={styles.innerContainer}>
              <Text style={styles.innerText}>Upcoming Billing Date</Text>
            </View>
            <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
              <Text style={styles.innerText}>{this.state.nextBillingDate}</Text>
            </View>
          </View>
          <React.Fragment>
          {
            this.state.faresDetails.map((item,index) => {
              return (
                <View key={index} style={{marginTop: 20}}>
                  <View style={styles.transactionMode}>
                    <Text style={[styles.innerText,{color: "#fff"}]}>Payment By {item.type?"Cash":"Online"}</Text>
                  </View>
                  <View style={styles.totalAmount}>
                    <View style={[styles.transactionDetails,{padding: 10}]}>
                      <Text style={styles.innerText}>Transaction Id: {item.transactionId}</Text>
                      <Text style={styles.innerText}>{item.date}</Text>
                      <Text style={[styles.innerText,{paddingTop: 15, paddingBottom: 15}]}>{item.name}</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.innerText}>Total Amount : {item.amount}</Text>
                      </View>
                    </View>
                    <View style={[styles.transactionDetails,{width: "30%",borderLeftWidth: 1,borderColor: "black",justifyContent: 'center',alignItems: 'center'}]}>
                      <Text style={{width: "100%",textAlign: 'center',color: item.type?"red":"green",fontSize: 30}}>{item.type?"-":"+"}{this.calculateFare(item.amount,item.type)}</Text>
                      <Text style={{width: "100%",textAlign: 'center',color: item.type?"red":"green"}}>{item.type?"(Debit)":"(Credit)"}</Text>
                    </View>
                  </View>
                </View>
                )
            })
          }
          </React.Fragment>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  fareContainer: {
  backgroundColor: "#ffffff",
  margin: 10
  },
  totalAmount: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black"
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: "70%"
  },
  innerText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  transactionMode: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#841584",
    height: 30,
    borderRadius: 5,
    width: 150
  },
  transactionDetails: {
    width: "70%"
  }
})