import React, {Component} from 'react'
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base'
import {StyleSheet} from 'react-native'
import utils from 'web3/lib/utils/utils'

export default class FromWei extends Component {
  fromWei = function () {
    this.equal(utils.fromWei(1000000000000000000, 'wei'), '1000000000000000000', `utils.fromWei(1000000000000000000, 'wei')`)
    this.equal(utils.fromWei(1000000000000000000, 'kwei'), '1000000000000000', `utils.fromWei(1000000000000000000, 'kwei')`)
    this.equal(utils.fromWei(1000000000000000000, 'mwei'), '1000000000000', `utils.fromWei(1000000000000000000, 'mwei')`)
    this.equal(utils.fromWei(1000000000000000000, 'gwei'), '1000000000', `utils.fromWei(1000000000000000000, 'gwei')`)
    this.equal(utils.fromWei(1000000000000000000, 'szabo'), '1000000', `utils.fromWei(1000000000000000000, 'szabo')`)
    this.equal(utils.fromWei(1000000000000000000, 'finney'), '1000', `utils.fromWei(1000000000000000000, 'finney')`)
    this.equal(utils.fromWei(1000000000000000000, 'ether'), '1', `utils.fromWei(1000000000000000000, 'ether')`)
    this.equal(utils.fromWei(1000000000000000000, 'kether'), '0.001', `utils.fromWei(1000000000000000000, 'kether')`)
    this.equal(utils.fromWei(1000000000000000000, 'grand'), '0.001', `utils.fromWei(1000000000000000000, 'grand')`)
    this.equal(utils.fromWei(1000000000000000000, 'mether'), '0.000001', `utils.fromWei(1000000000000000000, 'mether')`)
    this.equal(utils.fromWei(1000000000000000000, 'gether'), '0.000000001', `utils.fromWei(1000000000000000000, 'gether')`)
    this.equal(utils.fromWei(1000000000000000000, 'tether'), '0.000000000001', `utils.fromWei(1000000000000000000, 'tether')`)
  }

  toWei = function () {
    this.equal(utils.toWei(1, 'wei'), '1', `utils.toWei(1, 'wei')==1`)
    this.equal(utils.toWei(1, 'kwei'), '1000', `utils.toWei(1, 'kwei')===1000`)
    this.equal(utils.toWei(1, 'Kwei'), '1000', `utils.toWei(1, 'Kwei')===1000`)
    this.equal(utils.toWei(1, 'babbage'), '1000', `utils.toWei(1, 'babbage')===1000`)
    this.equal(utils.toWei(1, 'mwei'), '1000000', `utils.toWei(1, 'mwei')===1000000`)
    this.equal(utils.toWei(1, 'Mwei'), '1000000', `utils.toWei(1, 'Mwei')===1000000`)
    this.equal(utils.toWei(1, 'lovelace'), '1000000', `utils.toWei(1, 'lovelace')===1000000`)
    this.equal(utils.toWei(1, 'gwei'), '1000000000', `utils.toWei(1, 'gwei')===1000000000`)
    this.equal(utils.toWei(1, 'Gwei'), '1000000000', `utils.toWei(1, 'Gwei')===1000000000`)
    this.equal(utils.toWei(1, 'shannon'), '1000000000', `utils.toWei(1, 'shannon')===1000000000`)
    this.equal(utils.toWei(1, 'szabo'), '1000000000000', `utils.toWei(1, 'szabo')===1000000000000`)
    this.equal(utils.toWei(1, 'finney'), '1000000000000000', `utils.toWei(1, 'finney')===1000000000000000`)
    this.equal(utils.toWei(1, 'ether'), '1000000000000000000', `utils.toWei(1, 'ether')===1000000000000000000`)
    this.equal(utils.toWei(1, 'kether'), '1000000000000000000000', `utils.toWei(1, 'kether')===1000000000000000000000`)
    this.equal(utils.toWei(1, 'grand'), '1000000000000000000000', `utils.toWei(1, 'grand')===1000000000000000000000`)
    this.equal(utils.toWei(1, 'mether'), '1000000000000000000000000', `utils.toWei(1, 'mether')===1000000000000000000000000`)
    this.equal(utils.toWei(1, 'gether'), '1000000000000000000000000000', `utils.toWei(1, 'gether')===1000000000000000000000000000`)
    this.equal(utils.toWei(1, 'tether'), '1000000000000000000000000000000', `utils.toWei(1, 'tether')===1000000000000000000000000000000`)

    this.equal(utils.toWei(1, 'kwei'), utils.toWei(1, 'femtoether'), `utils.toWei(1, 'kwei')===utils.toWei(1, 'femtoether')`)
    this.equal(utils.toWei(1, 'szabo'), utils.toWei(1, 'microether'), `utils.toWei(1, 'szabo')===utils.toWei(1, 'microether')`)
    this.equal(utils.toWei(1, 'finney'), utils.toWei(1, 'milliether'), `utils.toWei(1, 'finney')===utils.toWei(1, 'milliether')`)
    this.equal(utils.toWei(1, 'milli'), utils.toWei(1, 'milliether'), `utils.toWei(1, 'milli')===utils.toWei(1, 'milliether')`)
    this.equal(utils.toWei(1, 'milli'), utils.toWei(1000, 'micro'), `utils.toWei(1, 'milli')===utils.toWei(1000, 'micro')`)
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Bip39</Title>
          </Body>
          <Right/>
        </Header>

        <Content style={{padding: 5}}>
          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.fromWei})
                  }}>
            <Text>FromWei</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.toWei})
                  }}>
            <Text>ToWei</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const s = StyleSheet.create({
  button: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#00B8C4',
    marginBottom: 10,
  }
})
